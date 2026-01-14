"""initial

Revision ID: 0001_initial
Revises: 
Create Date: 2026-01-14

"""

from alembic import op
import sqlalchemy as sa

revision = "0001_initial"
down_revision = None
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        "districts",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("name", sa.String(length=200), nullable=False, unique=True),
    )
    op.create_index("ix_districts_name", "districts", ["name"])

    op.create_table(
        "schools",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("district_id", sa.Integer(), sa.ForeignKey("districts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(length=200), nullable=False),
        sa.Column("external_id", sa.String(length=64), nullable=False),
        sa.UniqueConstraint("district_id", "external_id", name="uq_school_external"),
    )
    op.create_index("ix_schools_district_id", "schools", ["district_id"])
    op.create_index("ix_schools_external_id", "schools", ["external_id"])

    op.create_table(
        "users",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("district_id", sa.Integer(), sa.ForeignKey("districts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("email", sa.String(length=255), nullable=False, unique=True),
        sa.Column("password_hash", sa.String(length=255), nullable=False),
        sa.Column("role", sa.String(length=50), nullable=False, server_default="staff"),
        sa.Column("school_id", sa.Integer(), sa.ForeignKey("schools.id", ondelete="SET NULL"), nullable=True),
    )
    op.create_index("ix_users_district_id", "users", ["district_id"])
    op.create_index("ix_users_email", "users", ["email"])

    op.create_table(
        "students",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("district_id", sa.Integer(), sa.ForeignKey("districts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("school_id", sa.Integer(), sa.ForeignKey("schools.id", ondelete="CASCADE"), nullable=False),
        sa.Column("student_id", sa.String(length=64), nullable=False),
        sa.Column("first_name", sa.String(length=120), nullable=False),
        sa.Column("last_name", sa.String(length=120), nullable=False),
        sa.Column("grade", sa.String(length=20), nullable=False),
        sa.UniqueConstraint("district_id", "student_id", name="uq_student_studentid"),
    )
    op.create_index("ix_students_district_id", "students", ["district_id"])
    op.create_index("ix_students_school_id", "students", ["school_id"])
    op.create_index("ix_students_student_id", "students", ["student_id"])

    op.create_table(
        "attendance_records",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("student_id_fk", sa.Integer(), sa.ForeignKey("students.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("days_enrolled", sa.Float(), nullable=False, server_default="0"),
        sa.Column("days_absent", sa.Float(), nullable=False, server_default="0"),
    )
    op.create_index("ix_attendance_records_student_id_fk", "attendance_records", ["student_id_fk"])

    op.create_table(
        "academic_records",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("student_id_fk", sa.Integer(), sa.ForeignKey("students.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("credits_earned", sa.Float(), nullable=False, server_default="0"),
        sa.Column("credits_expected", sa.Float(), nullable=False, server_default="0"),
        sa.Column("growth_percentile", sa.Integer(), nullable=True),
    )
    op.create_index("ix_academic_records_student_id_fk", "academic_records", ["student_id_fk"])

    op.create_table(
        "student_readiness",
        sa.Column("id", sa.Integer(), primary_key=True),
        sa.Column("student_id_fk", sa.Integer(), sa.ForeignKey("students.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("status", sa.String(length=20), nullable=False, server_default="on_track"),
        sa.Column("risk_score", sa.Integer(), nullable=False, server_default="0"),
        sa.Column("reasons", sa.String(length=1000), nullable=False, server_default=""),
    )
    op.create_index("ix_student_readiness_student_id_fk", "student_readiness", ["student_id_fk"])

def downgrade():
    op.drop_table("student_readiness")
    op.drop_table("academic_records")
    op.drop_table("attendance_records")
    op.drop_table("students")
    op.drop_table("users")
    op.drop_table("schools")
    op.drop_table("districts")
