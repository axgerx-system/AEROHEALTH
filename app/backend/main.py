"""FastAPI application entry point."""
from contextlib import asynccontextmanager
import logging
from collections.abc import AsyncIterator

from fastapi import FastAPI, HTTPException, Request
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from src.inference import load_model
from .config import settings
from .routes.health import router as health_router
from .routes.engines import router as engines_router
from .routes.research import router as research_router
from .schemas import ErrorResponse
from .services.engine_service import EngineService

logger = logging.getLogger("aerohealth.api")


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncIterator[None]:
    app.state.model = None
    app.state.engine_service = None
    try:
        model = load_model(settings.model_path)
        if not callable(getattr(model, "predict", None)):
            raise TypeError("Loaded model does not provide a prediction interface.")
        app.state.model = model
        logger.info("Aerohealth model loaded.")
    except Exception:
        logger.exception("Aerohealth model could not be loaded during startup.")

    try:
        app.state.engine_service = EngineService.load(settings.data_dir)
        logger.info("FD001 test trajectories loaded.")
    except Exception:
        logger.exception("FD001 engine data could not be loaded during startup.")

    if app.state.model is not None and app.state.engine_service is not None:
        try:
            app.state.engine_service.set_predictions(app.state.model)
            logger.info("FD001 engine estimates prepared.")
        except Exception:
            logger.exception("FD001 inference could not be prepared during startup.")
    yield


app = FastAPI(
    title="Aerohealth API",
    description="API for the Aerohealth research prototype.",
    version="0.1.0",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.allowed_origins),
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Accept", "Content-Type"],
)
app.include_router(health_router, prefix="/api")
app.include_router(engines_router, prefix="/api")
app.include_router(research_router, prefix="/api")


@app.exception_handler(HTTPException)
async def http_error_handler(request: Request, exc: HTTPException) -> JSONResponse:
    detail = exc.detail
    if isinstance(detail, dict):
        code = str(detail.get("code", "request_error"))
        message = str(detail.get("message", "The request could not be completed."))
    else:
        code = {
            404: "not_found",
            422: "validation_error",
            503: "service_unavailable",
        }.get(exc.status_code, "request_error")
        message = str(detail)
    payload = ErrorResponse(error={"code": code, "message": message})
    return JSONResponse(status_code=exc.status_code, content=payload.model_dump())


@app.exception_handler(RequestValidationError)
async def validation_error_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    payload = ErrorResponse(
        error={"code": "validation_error", "message": "Request validation failed."}
    )
    return JSONResponse(status_code=422, content=payload.model_dump())


@app.exception_handler(Exception)
async def unexpected_error_handler(request: Request, exc: Exception) -> JSONResponse:
    logger.exception("Unhandled API error.")
    payload = ErrorResponse(
        error={"code": "internal_error", "message": "An internal API error occurred."}
    )
    return JSONResponse(status_code=500, content=payload.model_dump())
