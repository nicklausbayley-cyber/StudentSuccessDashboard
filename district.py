from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from base import Base

class District(Base):
    __tablename__ = "districts"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200), unique=True, index=True)

    schools = relationship("School", back_populates="district", cascade="all, delete-orphan")
    users = relationship("User", back_populates="district", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="district", cascade="all, delete-orphan")
