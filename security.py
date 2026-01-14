from datetime import datetime, timedelta
from typing import Any, Optional

from jose import jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)

def create_access_token(subject: str, extras: Optional[dict[str, Any]] = None) -> str:
    expire = datetime.utcnow() + timedelta(minutes=settings.JWT_ACCESS_TTL_MINUTES)
    to_encode: dict[str, Any] = {"sub": subject, "exp": expire}
    if extras:
        to_encode.update(extras)
    return jwt.encode(to_encode, settings.JWT_SECRET, algorithm=ALGORITHM)
