"""add district domains and sso fields

Revision ID: d4d98c4860cd
Revises: 
Create Date: 2026-03-30 00:38:08.740334
"""

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision = 'd4d98c4860cd'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'district_domains',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('district_id', sa.Integer(), nullable=False),
        sa.Column('email_domain', sa.String(length=255), nullable=False),
        sa.Column('provider_type', sa.String(length=50), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(['district_id'], ['districts.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_district_domains_district_id'), 'district_domains', ['district_id'], unique=False)
    op.create_index(op.f('ix_district_domains_email_domain'), 'district_domains', ['email_domain'], unique=True)

    op.add_column('students', sa.Column('student_email', sa.String(length=255), nullable=True))
    op.add_column('students', sa.Column('enrollment_status', sa.String(length=50), nullable=True))
    op.create_index(op.f('ix_students_student_email'), 'students', ['student_email'], unique=False)

    op.add_column('users', sa.Column('auth_provider', sa.String(length=50), nullable=True))
    op.add_column('users', sa.Column('external_subject_id', sa.String(length=255), nullable=True))
    op.add_column('users', sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.true()))
    op.add_column('users', sa.Column('last_login_at', sa.DateTime(), nullable=True))
    op.alter_column(
        'users',
        'password_hash',
        existing_type=sa.VARCHAR(length=255),
        nullable=True
    )
    op.drop_index('ix_users_email', table_name='users')
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=False)
    op.create_index(op.f('ix_users_external_subject_id'), 'users', ['external_subject_id'], unique=False)


def downgrade():
    op.drop_index(op.f('ix_users_external_subject_id'), table_name='users')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    op.alter_column(
        'users',
        'password_hash',
        existing_type=sa.VARCHAR(length=255),
        nullable=False
    )
    op.drop_column('users', 'last_login_at')
    op.drop_column('users', 'is_active')
    op.drop_column('users', 'external_subject_id')
    op.drop_column('users', 'auth_provider')

    op.drop_index(op.f('ix_students_student_email'), table_name='students')
    op.drop_column('students', 'enrollment_status')
    op.drop_column('students', 'student_email')

    op.drop_index(op.f('ix_district_domains_email_domain'), table_name='district_domains')
    op.drop_index(op.f('ix_district_domains_district_id'), table_name='district_domains')
    op.drop_table('district_domains')
