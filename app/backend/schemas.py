"""Typed API request and response schemas."""
from typing import Literal

from pydantic import BaseModel, Field


class HealthResponse(BaseModel):
    status: Literal["ok", "degraded"]
    service: Literal["aerohealth-api"] = "aerohealth-api"
    model_loaded: bool


class EngineSummary(BaseModel):
    engine_id: int = Field(ge=1)
    current_cycle: int = Field(ge=1)
    observed_cycles: int = Field(ge=1)


class EngineListResponse(BaseModel):
    dataset: str
    count: int = Field(ge=0)
    engines: list[EngineSummary]


class EngineDetailResponse(BaseModel):
    engine_id: int = Field(ge=1)
    dataset: str
    data_type: Literal["simulated_benchmark"]
    current_cycle: int = Field(ge=1)
    observed_cycles: int = Field(ge=1)
    available_sensors: list[str]


class ModelMetadataResponse(BaseModel):
    model_type: str
    objective: str
    alpha: float
    feature_count: int = Field(ge=1)


class PredictionResponse(BaseModel):
    engine_id: int = Field(ge=1)
    current_cycle: int = Field(ge=1)
    estimated_rul: float = Field(allow_inf_nan=False)
    estimate_type: Literal["model_estimate"]
    dataset: str
    model: ModelMetadataResponse


class PredictionContext(BaseModel):
    estimated_rul: float = Field(allow_inf_nan=False)
    estimate_type: Literal["model_estimate"]


class TrajectoryPoint(BaseModel):
    cycle: int = Field(ge=1)
    value: float = Field(allow_inf_nan=False)


class TrajectoryResponse(BaseModel):
    engine_id: int = Field(ge=1)
    dataset: str
    sensor: str
    current_cycle: int = Field(ge=1)
    observed_cycles: int = Field(ge=1)
    prediction_context: PredictionContext | None
    points: list[TrajectoryPoint]


class ErrorDetail(BaseModel):
    code: str
    message: str


class ErrorResponse(BaseModel):
    error: ErrorDetail


class ResearchMetricSet(BaseModel):
    mae: float = Field(ge=0, allow_inf_nan=False)
    rmse: float = Field(ge=0, allow_inf_nan=False)
    phm08: float = Field(ge=0, allow_inf_nan=False)


class ResearchModelResponse(BaseModel):
    model_type: str
    objective: str
    alpha: float
    n_estimators: int = Field(ge=1)
    max_depth: int
    num_leaves: int = Field(ge=2)
    learning_rate: float = Field(gt=0)
    subsample: float = Field(gt=0, le=1)
    colsample_bytree: float = Field(gt=0, le=1)
    random_state: int


class ResearchSummaryResponse(BaseModel):
    dataset: str
    feature_count: int = Field(ge=1)
    validation: ResearchMetricSet
    official_test: ResearchMetricSet
    model: ResearchModelResponse


class FeatureFamilyResponse(BaseModel):
    name: str
    count: int = Field(ge=1)
    description: str


class EngineSplitResponse(BaseModel):
    strategy: str
    train_engines: int = Field(ge=1)
    validation_engines: int = Field(ge=1)
    random_state: int


class ResearchMetricDefinition(BaseModel):
    name: str
    description: str
    unit: str | None = None


class ResearchMethodologyResponse(BaseModel):
    dataset: str
    data_type: Literal["simulated_benchmark"]
    target_definition: str
    target_note: str
    excluded_features: list[str]
    official_test_protocol: str
    feature_count: int = Field(ge=1)
    feature_families: list[FeatureFamilyResponse]
    variable_sensors: list[str]
    excluded_constant_sensors: list[str]
    split: EngineSplitResponse
    model: ResearchModelResponse
    evaluation_metrics: list[ResearchMetricDefinition]
    limitations: list[str]
