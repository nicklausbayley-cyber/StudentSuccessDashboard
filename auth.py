from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, EmailStr
from sqlalchemy.orm import Session

from deps import get_db
from district_domain import DistrictDomain
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

    user = find_user_by_email(db, email)

    if user:
        user.auth_provider = provider
        user.external_subject_id = external_subject_id
        user.last_login_at = datetime.utcnow()
        user.is_active = True
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


@router.post("/login", response_model=Token)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user = find_user_by_email(db, payload.email)
    if not user or not user.password_hash or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    user.last_login_at = datetime.utcnow()
    db.add(user)
    db.commit()

    token = create_access_token(
        str(user.id),
        extras={
            "district_id": user.district_id,
            "role": user.role,
        },
    )
    return Token(access_token=token)


@router.post("/sso/test-login", response_model=AuthenticatedUserResponse)
def sso_test_login(payload: SSOLoginRequest, db: Session = Depends(get_db)):
    provider = payload.provider.lower().strip()
    if provider not in {"google", "microsoft"}:
        raise HTTPException(status_code=400, detail="Unsupported provider")

    user = find_or_create_sso_user(
        db=db,
        email=payload.email,
        provider=provider,
        external_subject_id=payload.external_subject_id,
        default_role=payload.role or "staff",
    )
    return issue_app_token(user)