import csv, io
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from deps import get_current_user
from deps import get_db
from school import School
from student import Student
from attendance import AttendanceRecord
from academic import AcademicRecord
from readiness import StudentReadiness
from readiness_rules import compute_readiness

router = APIRouter()

def _require_same_district(current_user, district_id: int):
    if current_user.district_id != district_id:
        raise HTTPException(status_code=403, detail="Cross-district access denied")

def _require_admin(current_user):
    if current_user.role not in ("district_admin", "school_admin"):
        raise HTTPException(status_code=403, detail="Insufficient role")

@router.get("")
def list_students(
    status: str | None = None,
    school_id: int | None = None,
    grade: str | None = None,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    q = db.query(Student).filter(Student.district_id == current_user.district_id)
    if current_user.role in ("school_admin", "staff") and current_user.school_id is not None:
        q = q.filter(Student.school_id == current_user.school_id)
    if school_id is not None:
        q = q.filter(Student.school_id == school_id)
    if grade is not None:
        q = q.filter(Student.grade == grade)

    students = q.limit(1000).all()
    out = []
    for s in students:
        r = s.readiness
        if status is not None and r and r.status != status:
            continue
        out.append({
            "student_id": s.student_id,
            "first_name": s.first_name,
            "last_name": s.last_name,
            "grade": s.grade,
            "school_id": s.school_id,
            "status": (r.status if r else None),
            "reasons": (r.reasons if r else None),
        })
    return out

@router.post("/upload/roster")
async def upload_roster(
    district_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _require_same_district(current_user, district_id)
    _require_admin(current_user)

    content = (await file.read()).decode("utf-8", errors="ignore")
    reader = csv.DictReader(io.StringIO(content))
    required = {"student_id", "first_name", "last_name", "grade", "school_external_id"}
    if not required.issubset(set(reader.fieldnames or [])):
        raise HTTPException(status_code=400, detail=f"Roster CSV must include columns: {sorted(required)}")

    created, updated = 0, 0
    for row in reader:
        school_ext = (row.get("school_external_id") or "").strip()
        school = db.query(School).filter(School.district_id == district_id, School.external_id == school_ext).first()
        if not school:
            raise HTTPException(status_code=400, detail=f"Unknown school_external_id: {school_ext}")

        sid = (row.get("student_id") or "").strip()
        if not sid:
            continue

        student = db.query(Student).filter(Student.district_id == district_id, Student.student_id == sid).first()
        if not student:
            student = Student(
                district_id=district_id,
                school_id=school.id,
                student_id=sid,
                first_name=(row.get("first_name") or "").strip(),
                last_name=(row.get("last_name") or "").strip(),
                grade=(row.get("grade") or "").strip(),
            )
            db.add(student)
            db.flush()
            db.add(StudentReadiness(student_id_fk=student.id))
            created += 1
        else:
            student.school_id = school.id
            student.first_name = (row.get("first_name") or "").strip()
            student.last_name = (row.get("last_name") or "").strip()
            student.grade = (row.get("grade") or "").strip()
            updated += 1

    db.commit()
    return {"created": created, "updated": updated}

@router.post("/upload/attendance")
async def upload_attendance(
    district_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _require_same_district(current_user, district_id)
    _require_admin(current_user)

    content = (await file.read()).decode("utf-8", errors="ignore")
    reader = csv.DictReader(io.StringIO(content))
    required = {"student_id", "days_enrolled", "days_absent"}
    if not required.issubset(set(reader.fieldnames or [])):
        raise HTTPException(status_code=400, detail=f"Attendance CSV must include columns: {sorted(required)}")

    upserted, skipped = 0, 0
    for row in reader:
        sid = (row.get("student_id") or "").strip()
        student = db.query(Student).filter(Student.district_id == district_id, Student.student_id == sid).first()
        if not student:
            skipped += 1
            continue
        rec = db.query(AttendanceRecord).filter(AttendanceRecord.student_id_fk == student.id).first()
        if not rec:
            rec = AttendanceRecord(student_id_fk=student.id)
            db.add(rec)
        rec.days_enrolled = float(row.get("days_enrolled") or 0)
        rec.days_absent = float(row.get("days_absent") or 0)
        upserted += 1

    db.commit()
    return {"upserted": upserted, "skipped_unknown_students": skipped}

@router.post("/upload/academics")
async def upload_academics(
    district_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _require_same_district(current_user, district_id)
    _require_admin(current_user)

    content = (await file.read()).decode("utf-8", errors="ignore")
    reader = csv.DictReader(io.StringIO(content))
    required = {"student_id", "credits_earned", "credits_expected", "growth_percentile"}
    if not required.issubset(set(reader.fieldnames or [])):
        raise HTTPException(status_code=400, detail=f"Academics CSV must include columns: {sorted(required)}")

    upserted, skipped = 0, 0
    for row in reader:
        sid = (row.get("student_id") or "").strip()
        student = db.query(Student).filter(Student.district_id == district_id, Student.student_id == sid).first()
        if not student:
            skipped += 1
            continue
        rec = db.query(AcademicRecord).filter(AcademicRecord.student_id_fk == student.id).first()
        if not rec:
            rec = AcademicRecord(student_id_fk=student.id)
            db.add(rec)

        rec.credits_earned = float(row.get("credits_earned") or 0)
        rec.credits_expected = float(row.get("credits_expected") or 0)
        gp = row.get("growth_percentile")
        rec.growth_percentile = int(gp) if gp not in (None, "", "null", "None") else None
        upserted += 1

    db.commit()
    return {"upserted": upserted, "skipped_unknown_students": skipped}

@router.post("/recalculate")
def recalculate(
    district_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    _require_same_district(current_user, district_id)
    _require_admin(current_user)

    students = db.query(Student).filter(Student.district_id == district_id).all()
    updated = 0
    for s in students:
        ar = s.attendance.attendance_rate if s.attendance else None
        gp = s.academics.growth_percentile if s.academics else None
        ce = s.academics.credits_earned if s.academics else None
        cx = s.academics.credits_expected if s.academics else None
        result = compute_readiness(ar, gp, ce, cx)
        if not s.readiness:
            s.readiness = StudentReadiness(student_id_fk=s.id)
        s.readiness.status = result.status
        s.readiness.risk_score = result.score
        s.readiness.reasons = ", ".join(result.reasons)
        updated += 1

    db.commit()
    return {"updated": updated}
