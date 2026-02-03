from sqlalchemy import ForeignKey, Float, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from base import Base

class AcademicRecord(Base):
    __tablename__ = "academic_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id_fk: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), unique=True, index=True)
    credits_earned: Mapped[float] = mapped_column(Float, default=0)
    credits_expected: Mapped[float] = mapped_column(Float, default=0)
    growth_percentile: Mapped[int | None] = mapped_column(Integer, nullable=True)

    student = relationship("Student", back_populates="academics")
