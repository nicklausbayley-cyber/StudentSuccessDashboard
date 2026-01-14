from sqlalchemy import ForeignKey, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base

class Student(Base):
    __tablename__ = "students"
    __table_args__ = (UniqueConstraint("district_id", "student_id", name="uq_student_studentid"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    district_id: Mapped[int] = mapped_column(ForeignKey("districts.id", ondelete="CASCADE"), index=True)
    school_id: Mapped[int] = mapped_column(ForeignKey("schools.id", ondelete="CASCADE"), index=True)

    student_id: Mapped[str] = mapped_column(String(64), index=True)
    first_name: Mapped[str] = mapped_column(String(120))
    last_name: Mapped[str] = mapped_column(String(120))
    grade: Mapped[str] = mapped_column(String(20))

    district = relationship("District", back_populates="students")
    school = relationship("School", back_populates="students")
    attendance = relationship("AttendanceRecord", back_populates="student", uselist=False, cascade="all, delete-orphan")
    academics = relationship("AcademicRecord", back_populates="student", uselist=False, cascade="all, delete-orphan")
    readiness = relationship("StudentReadiness", back_populates="student", uselist=False, cascade="all, delete-orphan")
