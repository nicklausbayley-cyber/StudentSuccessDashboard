from sqlalchemy import Boolean, ForeignKey, String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from base import Base

class DistrictDomain(Base):
    __tablename__ = "district_domains"

    id: Mapped[int] = mapped_column(primary_key=True)
    district_id: Mapped[int] = mapped_column(ForeignKey("districts.id", ondelete="CASCADE"), index=True)
    email_domain: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    provider_type: Mapped[str] = mapped_column(String(50))  # google or microsoft
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    district = relationship("District")