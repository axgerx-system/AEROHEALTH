"""FD001 engine, prediction, and trajectory endpoints."""
from enum import Enum

from fastapi import APIRouter, HTTPException, Path, Query, Request

from src.features import VARIABLE_SENSORS
from ..schemas import (
    EngineDetailResponse,
    EngineListResponse,
    ErrorResponse,
    PredictionResponse,
    TrajectoryResponse,
)
from ..services.engine_service import (
    EngineNotFoundError,
    EngineService,
    ModelUnavailableError,
)

router = APIRouter()
SensorChannel = Enum(
    "SensorChannel",
    {sensor: sensor for sensor in VARIABLE_SENSORS},
    type=str,
)


def _engine_service(request: Request) -> EngineService:
    service = getattr(request.app.state, "engine_service", None)
    if service is None:
        raise HTTPException(
            status_code=503,
            detail={"code": "dataset_unavailable", "message": "FD001 engine data is unavailable."},
        )
    return service


def _not_found() -> HTTPException:
    return HTTPException(
        status_code=404,
        detail={"code": "engine_not_found", "message": "The requested engine is not in the FD001 test set."},
    )


@router.get(
    "/engines",
    response_model=EngineListResponse,
    responses={503: {"model": ErrorResponse}},
)
def list_engines(request: Request) -> EngineListResponse:
    service = _engine_service(request)
    engines = service.list_engines()
    return EngineListResponse(dataset="NASA C-MAPSS FD001", count=len(engines), engines=engines)


@router.get(
    "/engines/{engine_id}",
    response_model=EngineDetailResponse,
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
)
def get_engine(
    request: Request,
    engine_id: int = Path(gt=0),
) -> EngineDetailResponse:
    service = _engine_service(request)
    try:
        return EngineDetailResponse(**service.engine_detail(engine_id))
    except EngineNotFoundError as exc:
        raise _not_found() from exc


@router.get(
    "/engines/{engine_id}/prediction",
    response_model=PredictionResponse,
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
)
def get_engine_prediction(
    request: Request,
    engine_id: int = Path(gt=0),
) -> PredictionResponse:
    service = _engine_service(request)
    try:
        return PredictionResponse(**service.prediction(engine_id))
    except EngineNotFoundError as exc:
        raise _not_found() from exc
    except ModelUnavailableError as exc:
        raise HTTPException(
            status_code=503,
            detail={"code": "model_unavailable", "message": "The prediction service is unavailable."},
        ) from exc


@router.get(
    "/engines/{engine_id}/trajectory",
    response_model=TrajectoryResponse,
    responses={404: {"model": ErrorResponse}, 422: {"model": ErrorResponse}, 503: {"model": ErrorResponse}},
)
def get_engine_trajectory(
    request: Request,
    engine_id: int = Path(gt=0),
    sensor: SensorChannel = Query(default=SensorChannel.sensor_2),
) -> TrajectoryResponse:
    service = _engine_service(request)
    try:
        return TrajectoryResponse(**service.trajectory(engine_id, sensor.value))
    except EngineNotFoundError as exc:
        raise _not_found() from exc
