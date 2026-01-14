# Student Readiness MVP Backend (FastAPI + Postgres)

This starter repo matches the MVP checklist:
- Multi-tenant via `district_id`
- JWT auth + RBAC
- CSV uploads (roster, attendance, academics)
- Rules-based readiness calculation

## Run locally
```bash
cp .env.example .env
docker compose up --build
docker compose exec api alembic upgrade head
```

Seed demo district/admin:
- http://localhost:8000/docs
- POST /api/dev/seed
  - admin: admin@demo.local
  - password: ChangeMe123!

Upload templates (see /templates) and recalc readiness:
- POST /api/students/upload/roster?district_id=...
- POST /api/students/upload/attendance?district_id=...
- POST /api/students/upload/academics?district_id=...
- POST /api/students/recalculate?district_id=...
