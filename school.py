from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class School(Base):
    __tablename__ = "schools"
    __table_args__ = (UniqueConstraint("district_id", "external_id", name="uq_school_external"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    district_id: Mapped[int] = mapped_column(ForeignKey("districts.id", ondelete="CASCADE"), index=True)
    name: Mapped[str] = mapped_column(String(200))
    external_id: Mapped[str] = mapped_column(String(64), index=True)

    district = relationship("District", back_populates="schools")
    students = relationship("Student", back_populates="school", cascade="all, delete-orphan")
