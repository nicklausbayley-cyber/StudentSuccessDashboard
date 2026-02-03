from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from deps import get_db
from district import District
from school import School
from user import User
from security import hash_password

router = APIRouter()

@router.post("/seed")
def seed(db: Session = Depends(get_db)):
    """Development-only helper: creates a demo district, school, and district admin."""
    district = db.query(District).filter(District.name == "Demo District").first()
    if not district:
        district = District(name="Demo District")
        db.add(district)
        db.flush()

    school = db.query(School).filter(School.district_id == district.id, School.external_id == "HS-1").first()
    if not school:
        school = School(district_id=district.id, name="Demo High School", external_id="HS-1")
        db.add(school)
        db.flush()

    admin = db.query(User).filter(User.email == "admin@demo.local").first()
    if not admin:
        admin = User(
            district_id=district.id,
            email="admin@demo.local",
            password_hash=hash_password("ChangeMe123!"),
            role="district_admin",
            school_id=None,
        )
        db.add(admin)

    db.commit()
    return {
        "district_id": district.id,
        "school_id": school.id,
        "admin_email": "admin@demo.local",
        "admin_password": "ChangeMe123!"
    }
