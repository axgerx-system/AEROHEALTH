"""Environment-backed settings for the Aerohealth API."""
from dataclasses import dataclass
import os
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]


def _project_path(variable: str, default: Path) -> Path:
    configured = os.getenv(variable)
    path = Path(configured).expanduser() if configured else default
    if not path.is_absolute():
        path = PROJECT_ROOT / path
    return path.resolve()


def _allowed_origins(environment: str) -> tuple[str, ...]:
    configured = os.getenv("AEROHEALTH_ALLOWED_ORIGINS")
    if environment in {"prod", "production"} and not configured:
        raise ValueError(
            "Set AEROHEALTH_ALLOWED_ORIGINS explicitly for production."
        )
    raw = configured or "http://localhost:3000,http://127.0.0.1:3000"
    origins = tuple(origin.strip() for origin in raw.split(",") if origin.strip())
    if not origins:
        raise ValueError("AEROHEALTH_ALLOWED_ORIGINS must contain at least one origin.")
    if "*" in origins:
        raise ValueError("Wildcard CORS origins are not supported.")
    return origins


@dataclass(frozen=True)
class Settings:
    environment: str
    model_path: Path
    data_dir: Path
    allowed_origins: tuple[str, ...]


def load_settings() -> Settings:
    environment = os.getenv("AEROHEALTH_ENVIRONMENT", "development").strip().lower()
    return Settings(
        environment=environment,
        model_path=_project_path(
            "AEROHEALTH_MODEL_PATH",
            PROJECT_ROOT / "models" / "aerohealth_lgbm_quantile_alpha_040.joblib",
        ),
        data_dir=_project_path("AEROHEALTH_DATA_DIR", PROJECT_ROOT / "data" / "raw"),
        allowed_origins=_allowed_origins(environment),
    )


settings = load_settings()
