from sqlalchemy import ForeignKey, String, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from base import Base

class StudentReadiness(Base):
    __tablename__ = "student_readiness"

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id_fk: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), unique=True, index=True)
    status: Mapped[str] = mapped_column(String(20), default="on_track")
    risk_score: Mapped[int] = mapped_column(Integer, default=0)
    reasons: Mapped[str] = mapped_column(String(1000), default="")

    student = relationship("Student", back_populates="readiness")
