from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    POSTGRES_HOST: str = "db"
    POSTGRES_PORT: int = 5432
    POSTGRES_DB: str = "readiness"
    POSTGRES_USER: str = "readiness"
    POSTGRES_PASSWORD: str = "readiness_password"

    APP_ENV: str = "development"
    APP_NAME: str = "student-readiness-mvp"
    JWT_SECRET: str = "change_me_in_production"
    JWT_ACCESS_TTL_MINUTES: int = 120
    CORS_ORIGINS: str = ""

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}"
            f"@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
        )

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
