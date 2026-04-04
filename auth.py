from datetime import datetime
from urllib.parse import urlencode

import httpx
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import RedirectResponse
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from config import settings
from deps import get_db
from district_domain import DistrictDomain
from student import Student
from user import User
from security import verify_password, create_access_token

router = APIRouter()


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class SSOLoginRequest(BaseModel):
    email: EmailStr
    provider: str  # "google" or "microsoft"
    external_subject_id: str
    role: str | None = None


class AuthenticatedUserResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    district_id: int
    role: str
    email: EmailStr


def get_email_domain(email: str) -> str:
    return email.split("@")[-1].lower().strip()


def resolve_district_by_email_domain(db: Session, email: str) -> DistrictDomain | None:
    domain = get_email_domain(email)
    return (
        db.query(DistrictDomain)
        .filter(DistrictDomain.email_domain == domain, DistrictDomain.is_active == True)
        .first()
    )


def find_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def find_student_by_email(db: Session, email: str) -> Student | None:
    return db.query(Student).filter(Student.student_email == email).first()


def find_or_create_sso_user(
    db: Session,
    email: str,
    provider: str,
    external_subject_id: str,
    default_role: str = "staff",
) -> User:
    district_domain = resolve_district_by_email_domain(db, email)
    if not district_domain:
        raise HTTPException(status_code=403, detail="Email domain is not associated with any district")

    existing_user = find_user_by_email(db, email)
    if existing_user:
        existing_user.auth_provider = provider
        existing_user.external_subject_id = external_subject_id
        existing_user.last_login_at = datetime.utcnow()
        existing_user.is_active = True
        db.add(existing_user)
        db.commit()
        db.refresh(existing_user)
        return existing_user

    matched_student = find_student_by_email(db, email)
    if matched_student:
        user = User(
            district_id=matched_student.district_id,
            school_id=matched_student.school_id,
            email=email,
            role="student",
            auth_provider=provider,
            external_subject_id=external_subject_id,
            is_active=True,
            last_login_at=datetime.utcnow(),
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    user = User(
        district_id=district_domain.district_id,
        email=email,
        role=default_role,
        auth_provider=provider,
        external_subject_id=external_subject_id,
        is_active=True,
        last_login_at=datetime.utcnow(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def issue_basic_token(user: User) -> Token:
    token = create_access_token(
        str(user.id),
        extras={
            "district_id": user.district_id,
            "role": user.role,
        },
    )
    return Token(access_token=token)


def issue_app_token(user: User) -> AuthenticatedUserResponse:
    token = create_access_token(
        str(user.id),
        extras={
            "district_id": user.district_id,
            "role": user.role,
        },
    )
    return AuthenticatedUserResponse(
        access_token=token,
        user_id=user.id,
        district_id=user.district_id,
        role=user.role,
        email=user.email,
    )


def finalize_sso_login(
    db: Session,
    email: str,
    provider: str,
    external_subject_id: str,
    default_role: str = "staff",
) -> AuthenticatedUserResponse:
    user = find_or_create_sso_user(
        db=db,
        email=email,
        provider=provider,
        external_subject_id=external_subject_id,
        default_role=default_role,
    )
    return issue_app_token(user)


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = find_user_by_email(db, payload.email)
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user.last_login_at = datetime.utcnow()
    db.add(user)
    db.commit()

    return issue_basic_token(user)


@router.post("/sso/test-login", response_model=AuthenticatedUserResponse)
def sso_test_login(payload: SSOLoginRequest, db: Session = Depends(get_db)):
    provider = payload.provider.lower().strip()
    if provider not in {"google", "microsoft"}:
        raise HTTPException(status_code=400, detail="Unsupported provider")

    return finalize_sso_login(
        db=db,
        email=payload.email,
        provider=provider,
        external_subject_id=payload.external_subject_id,
        default_role=payload.role or "staff",
    )


@router.get("/sso/google/start")
def google_sso_start():
    if not settings.GOOGLE_CLIENT_ID:
        raise HTTPException(status_code=500, detail="GOOGLE_CLIENT_ID is not configured")

    params = {
        "client_id": settings.GOOGLE_CLIENT_ID,
        "redirect_uri": settings.google_redirect_uri,
        "response_type": "code",
        "scope": "openid email profile",
        "access_type": "offline",
        "prompt": "consent",
    }
    google_auth_url = f"https://accounts.google.com/o/oauth2/v2/auth?{urlencode(params)}"
    return RedirectResponse(url=google_auth_url)


@router.get("/sso/google/callback", response_model=AuthenticatedUserResponse)
def google_sso_callback(
    code: str | None = Query(default=None),
    state: str | None = Query(default=None),
    db: Session = Depends(get_db),
):
    if not code:
        raise HTTPException(status_code=400, detail="Missing authorization code")

    token_payload = {
        "code": code,
        "client_id": settings.GOOGLE_CLIENT_ID,
        "client_secret": settings.GOOGLE_CLIENT_SECRET,
        "redirect_uri": settings.google_redirect_uri,
        "grant_type": "authorization_code",
    }

    try:
        with httpx.Client(timeout=20.0) as client:
            token_response = client.post(settings.GOOGLE_TOKEN_URL, data=token_payload)
            token_response.raise_for_status()
            token_json = token_response.json()

            access_token = token_json.get("access_token")
            if not access_token:
                raise HTTPException(status_code=400, detail="Google token response did not include access_token")

            userinfo_response = client.get(
                settings.GOOGLE_USERINFO_URL,
                headers={"Authorization": f"Bearer {access_token}"},
            )
            userinfo_response.raise_for_status()
            userinfo = userinfo_response.json()
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Google OAuth exchange failed: {exc}") from exc

    email = userinfo.get("email")
    external_subject_id = userinfo.get("sub")

    if not email or not external_subject_id:
        raise HTTPException(status_code=400, detail="Google userinfo response missing required identity fields")

    return finalize_sso_login(
        db=db,
        email=email,
        provider="google",
        external_subject_id=external_subject_id,
        default_role="staff",
    )