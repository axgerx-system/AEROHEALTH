"""Verified research metadata exposed through the API."""
from src.features import CONSTANT_SENSORS, MODEL_FEATURE_COLUMNS, VARIABLE_SENSORS
from src.model import FINAL_MODEL_CONFIG

DATASET_NAME = "NASA C-MAPSS FD001"

# Reference-run metrics recorded in the canonical research notebook audit.
VALIDATION_METRICS = {
    "mae": 22.5047619483,
    "rmse": 30.3939752307,
    "phm08": 135081.586323,
}
OFFICIAL_TEST_METRICS = {
    "mae": 16.517002088,
    "rmse": 22.402840325,
    "phm08": 1175.475245,
}


def _model_metadata() -> dict:
    config = FINAL_MODEL_CONFIG
    return {
        "model_type": "LightGBM",
        "objective": config["objective"],
        "alpha": config["alpha"],
        "n_estimators": config["n_estimators"],
        "max_depth": config["max_depth"],
        "num_leaves": config["num_leaves"],
        "learning_rate": config["learning_rate"],
        "subsample": config["subsample"],
        "colsample_bytree": config["colsample_bytree"],
        "random_state": config["random_state"],
    }


def research_summary() -> dict:
    return {
        "dataset": DATASET_NAME,
        "feature_count": len(MODEL_FEATURE_COLUMNS),
        "validation": VALIDATION_METRICS.copy(),
        "official_test": OFFICIAL_TEST_METRICS.copy(),
        "model": _model_metadata(),
    }


def research_methodology() -> dict:
    return {
        "dataset": DATASET_NAME,
        "data_type": "simulated_benchmark",
        "target_definition": "final_cycle - current_cycle",
        "target_note": "The piecewise 125-cycle cap is used only in sensitivity and history analyses. It is not applied to the final target.",
        "excluded_features": ["relative_life", "setting_3"],
        "official_test_protocol": "The final model is trained on all available FD001 training observations and evaluated on the separate official test set with its provided RUL targets.",
        "feature_count": len(MODEL_FEATURE_COLUMNS),
        "feature_families": [
            {
                "name": "operating_settings",
                "count": 2,
                "description": "setting_1 and setting_2",
            },
            {
                "name": "raw_variable_sensors",
                "count": len(VARIABLE_SENSORS),
                "description": "Current readings from the 15 variable FD001 sensor channels",
            },
            {
                "name": "rolling_mean_5",
                "count": len(VARIABLE_SENSORS),
                "description": "Five-cycle rolling means",
            },
            {
                "name": "rolling_std_5",
                "count": len(VARIABLE_SENSORS),
                "description": "Five-cycle rolling standard deviations",
            },
            {
                "name": "first_difference_1",
                "count": len(VARIABLE_SENSORS),
                "description": "Differences from the preceding observed cycle",
            },
            {
                "name": "cycle_age",
                "count": 1,
                "description": "Current observed cycle number",
            },
            {
                "name": "causal_trend_10",
                "count": len(VARIABLE_SENSORS),
                "description": "Causal ten-cycle trends using current and past observations",
            },
        ],
        "variable_sensors": list(VARIABLE_SENSORS),
        "excluded_constant_sensors": list(CONSTANT_SENSORS),
        "split": {
            "strategy": "Engine-level 80/20 split of the 100 FD001 training engines",
            "train_engines": 80,
            "validation_engines": 20,
            "random_state": 42,
        },
        "model": _model_metadata(),
        "evaluation_metrics": [
            {
                "name": "MAE",
                "description": "Average absolute difference between estimated and true RUL.",
                "unit": "operating cycles",
            },
            {
                "name": "RMSE",
                "description": "Root mean squared error, which gives larger errors more weight.",
                "unit": "operating cycles",
            },
            {
                "name": "PHM08",
                "description": "Asymmetric aggregate benchmark score. Late estimates are penalized more than early estimates. Lower is better.",
                "unit": None,
            },
        ],
        "limitations": [
            "FD001 is a simulated turbofan degradation benchmark, not real aircraft telemetry.",
            "Benchmark results do not establish performance on operational aircraft engines.",
            "RUL outputs are model estimates, not exact failure times or maintenance recommendations.",
            "The prototype is not certified aviation safety software.",
        ],
    }
