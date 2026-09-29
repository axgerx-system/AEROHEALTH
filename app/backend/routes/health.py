"""Service health endpoint."""
from fastapi import APIRouter, Request, Response

from ..schemas import HealthResponse

router = APIRouter()


@router.get("/health", response_model=HealthResponse, responses={503: {"model": HealthResponse}})
def get_health(request: Request, response: Response) -> HealthResponse:
    model = getattr(request.app.state, "model", None)
    model_loaded = model is not None and callable(getattr(model, "predict", None))
    if not model_loaded:
        response.status_code = 503
    return HealthResponse(
        status="ok" if model_loaded else "degraded",
        service="aerohealth-api",
        model_loaded=model_loaded,
    )
