"""Dataset-backed engine and inference services."""
from dataclasses import asdict, dataclass
import math
from pathlib import Path

import pandas as pd

from src.data_loader import load_fd001
from src.features import MODEL_FEATURE_COLUMNS, VARIABLE_SENSORS
from src.inference import predict_last_cycle

DATASET_NAME = "NASA C-MAPSS FD001"


class EngineNotFoundError(LookupError):
    """Requested engine identifier is not present in the FD001 test set."""


class ModelUnavailableError(RuntimeError):
    """Model predictions are not available."""


@dataclass(frozen=True)
class ModelMetadata:
    model_type: str
    objective: str
    alpha: float
    feature_count: int


class EngineService:
    def __init__(self, test_data: pd.DataFrame):
        if test_data.empty:
            raise ValueError("FD001 test data is empty.")
        required = {"unit_id", "cycle", *VARIABLE_SENSORS}
        missing = sorted(required.difference(test_data.columns))
        if missing:
            raise ValueError(f"FD001 test data is missing required columns: {missing}")

        self._engines = {
            int(engine_id): rows.sort_values("cycle").reset_index(drop=True)
            for engine_id, rows in test_data.groupby("unit_id", sort=True)
        }
        if not self._engines:
            raise ValueError("FD001 test data contains no engine trajectories.")
        self._predictions: dict[int, float] | None = None
        self._model_metadata: ModelMetadata | None = None

    @classmethod
    def load(cls, data_dir: Path) -> "EngineService":
        _, test_data, rul_targets = load_fd001(data_dir)
        service = cls(test_data)
        if len(rul_targets) != len(service._engines):
            raise ValueError("FD001 test trajectories and RUL targets do not align.")
        return service

    @property
    def engine_ids(self) -> list[int]:
        return sorted(self._engines)

    def _rows(self, engine_id: int) -> pd.DataFrame:
        try:
            return self._engines[engine_id]
        except KeyError as exc:
            raise EngineNotFoundError from exc

    def set_predictions(self, model) -> None:
        prediction_frame = predict_last_cycle(
            model,
            pd.concat(self._engines.values(), ignore_index=True),
        )
        prediction_ids = [int(engine_id) for engine_id in prediction_frame["unit_id"]]
        if prediction_ids != self.engine_ids:
            raise ValueError("Inference output does not match the FD001 test engines.")

        values = prediction_frame["predicted_RUL"].astype(float).tolist()
        if not all(math.isfinite(value) for value in values):
            raise ValueError("Inference returned a non-finite RUL estimate.")

        get_params = getattr(model, "get_params", None)
        if not callable(get_params):
            raise TypeError("Loaded model does not expose model parameters.")
        params = get_params(deep=False)
        objective = params.get("objective")
        alpha = params.get("alpha")
        if not isinstance(objective, str) or alpha is None:
            raise ValueError("Loaded model is missing expected metadata.")
        module = type(model).__module__
        model_type = "LightGBM" if module.startswith("lightgbm") else type(model).__name__

        self._predictions = dict(zip(prediction_ids, values, strict=True))
        self._model_metadata = ModelMetadata(
            model_type=model_type,
            objective=objective,
            alpha=float(alpha),
            feature_count=len(MODEL_FEATURE_COLUMNS),
        )

    def list_engines(self) -> list[dict[str, int]]:
        return [
            {
                "engine_id": engine_id,
                "current_cycle": int(rows["cycle"].iloc[-1]),
                "observed_cycles": len(rows),
            }
            for engine_id, rows in sorted(self._engines.items())
        ]

    def engine_detail(self, engine_id: int) -> dict:
        rows = self._rows(engine_id)
        return {
            "engine_id": engine_id,
            "dataset": DATASET_NAME,
            "data_type": "simulated_benchmark",
            "current_cycle": int(rows["cycle"].iloc[-1]),
            "observed_cycles": len(rows),
            "available_sensors": list(VARIABLE_SENSORS),
        }

    def prediction(self, engine_id: int) -> dict:
        self._rows(engine_id)
        if self._predictions is None or self._model_metadata is None:
            raise ModelUnavailableError
        return {
            "engine_id": engine_id,
            "current_cycle": int(self._rows(engine_id)["cycle"].iloc[-1]),
            "estimated_rul": self._predictions[engine_id],
            "estimate_type": "model_estimate",
            "dataset": DATASET_NAME,
            "model": asdict(self._model_metadata),
        }

    def trajectory(self, engine_id: int, sensor: str) -> dict:
        rows = self._rows(engine_id)
        if sensor not in VARIABLE_SENSORS:
            raise ValueError("Sensor is not a variable FD001 model input.")
        current_cycle = int(rows["cycle"].iloc[-1])
        prediction_context = None
        if self._predictions is not None:
            prediction_context = {
                "estimated_rul": self._predictions[engine_id],
                "estimate_type": "model_estimate",
            }
        return {
            "engine_id": engine_id,
            "dataset": DATASET_NAME,
            "sensor": sensor,
            "current_cycle": current_cycle,
            "observed_cycles": len(rows),
            "prediction_context": prediction_context,
            "points": [
                {"cycle": int(row.cycle), "value": float(getattr(row, sensor))}
                for row in rows[["cycle", sensor]].itertuples(index=False)
            ],
        }
