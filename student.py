from sqlalchemy import ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from base import Base

class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True)
    district_id: Mapped[int] = mapped_column(ForeignKey("districts.id", ondelete="CASCADE"), index=True)
    school_id: Mapped[int | None] = mapped_column(ForeignKey("schools.id", ondelete="SET NULL"), nullable=True)

    student_id: Mapped[str] = mapped_column(String(64), index=True)
    first_name: Mapped[str] = mapped_column(String(120))
    last_name: Mapped[str] = mapped_column(String(120))
    grade: Mapped[str] = mapped_column(String(20))
    student_email: Mapped[str | None] = mapped_column(String(255), nullable=True, index=True)
    enrollment_status: Mapped[str | None] = mapped_column(String(50), nullable=True)

    district = relationship("District", back_populates="students")
    school = relationship("School")
    attendance = relationship("AttendanceRecord", back_populates="student", uselist=False, cascade="all, delete-orphan")
    academic = relationship("AcademicRecord", back_populates="student", uselist=False, cascade="all, delete-orphan")
    readiness = relationship("StudentReadiness", back_populates="student", uselist=False, cascade="all, delete-orphan")
