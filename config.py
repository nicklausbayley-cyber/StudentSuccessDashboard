from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "readiness"
    POSTGRES_USER: str = "readiness"
    POSTGRES_PASSWORD: str = "readiness_password"

    APP_ENV: str = "development"
    APP_NAME: str = "student-readiness-mvp"
    APP_BASE_URL: str = "http://localhost:8000"
    FRONTEND_BASE_URL: str = "http://localhost:5173"

    JWT_SECRET: str = "change_me_in_production"
    JWT_ACCESS_TTL_MINUTES: int = 120
    CORS_ORIGINS: str = ""

    GOOGLE_CLIENT_ID: str = ""
    GOOGLE_CLIENT_SECRET: str = ""
    GOOGLE_REDIRECT_PATH: str = "/api/auth/sso/google/callback"
    GOOGLE_TOKEN_URL: str = "https://oauth2.googleapis.com/token"
    GOOGLE_USERINFO_URL: str = "https://openidconnect.googleapis.com/v1/userinfo"

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    @property
    def google_redirect_uri(self) -> str:
        return f"{self.APP_BASE_URL}{self.GOOGLE_REDIRECT_PATH}"

    @property
    def frontend_auth_callback_url(self) -> str:
        return f"{self.FRONTEND_BASE_URL}/auth/callback"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()