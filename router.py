from fastapi import APIRouter
from app.api.routes import auth, dev, students

api_router = APIRouter()
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(dev.router, prefix="/dev", tags=["dev"])
api_router.include_router(students.router, prefix="/students", tags=["students"])
