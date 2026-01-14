from sqlalchemy import ForeignKey, Float
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class AttendanceRecord(Base):
    __tablename__ = "attendance_records"

    id: Mapped[int] = mapped_column(primary_key=True)
    student_id_fk: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), unique=True, index=True)
    days_enrolled: Mapped[float] = mapped_column(Float, default=0)
    days_absent: Mapped[float] = mapped_column(Float, default=0)

    student = relationship("Student", back_populates="attendance")

    @property
    def attendance_rate(self) -> float:
        if self.days_enrolled <= 0:
            return 1.0
        return max(0.0, min(1.0, (self.days_enrolled - self.days_absent) / self.days_enrolled))
