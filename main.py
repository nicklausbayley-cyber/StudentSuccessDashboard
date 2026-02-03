from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import settings
from router import api_router

app = FastAPI(title="Student Success Dashboard API", redirect_slashes=False)

# CORS (ok for dev)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health():
    return {
        "status": "ok",
        "env": getattr(settings, "ENV", getattr(settings, "ENVIRONMENT", "unknown")),
    }

app.include_router(api_router, prefix="/api")
