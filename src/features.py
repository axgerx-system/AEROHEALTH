import numpy as np
import pandas as pd

SENSOR_COLUMNS = [f"sensor_{i}" for i in range(1, 22)]
CONSTANT_SENSORS = ["sensor_1", "sensor_5", "sensor_10", "sensor_16", "sensor_18", "sensor_19"]
VARIABLE_SENSORS = [s for s in SENSOR_COLUMNS if s not in CONSTANT_SENSORS]
RAW_MODEL_SENSORS = VARIABLE_SENSORS.copy()

MODEL_FEATURE_COLUMNS = (
    ["setting_1", "setting_2"]
    + RAW_MODEL_SENSORS
    + [f"{s}_rollmean_5" for s in VARIABLE_SENSORS]
    + [f"{s}_rollstd_5" for s in VARIABLE_SENSORS]
    + [f"{s}_diff_1" for s in VARIABLE_SENSORS]
    + ["cycle_age"]
    + [f"{s}_trend_10" for s in VARIABLE_SENSORS]
)

assert len(MODEL_FEATURE_COLUMNS) == 78
assert "relative_life" not in MODEL_FEATURE_COLUMNS


def causal_rolling_slope(values, window=10):
    arr = np.asarray(values, dtype=float)
    result = np.full(arr.shape, np.nan, dtype=float)
    if len(arr) < 2:
        return result
    for n in range(2, min(window, len(arr) + 1)):
        y = arr[:n]
        if np.isnan(y).any():
            continue
        x = np.arange(n, dtype=float)
        centered_x = x - x.mean()
        denominator = np.sum(centered_x ** 2)
        result[n - 1] = np.sum(centered_x * (y - y.mean())) / denominator
    if len(arr) >= window:
        x = np.arange(window, dtype=float)
        centered_x = x - x.mean()
        denominator = np.sum(centered_x ** 2)
        weights = centered_x[::-1]
        numerator = np.convolve(arr, weights, mode="valid")
        result[window - 1:] = numerator / denominator
    return result


def engineer_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.sort_values(["unit_id", "cycle"]).reset_index(drop=True).copy()
    for sensor in VARIABLE_SENSORS:
        grouped = out.groupby("unit_id")[sensor]
        out[f"{sensor}_rollmean_5"] = grouped.transform(lambda x: x.rolling(5, min_periods=1).mean())
        out[f"{sensor}_rollstd_5"] = grouped.transform(lambda x: x.rolling(5, min_periods=2).std())
        out[f"{sensor}_diff_1"] = grouped.diff(1)
        out[f"{sensor}_trend_10"] = grouped.transform(lambda x: causal_rolling_slope(x.to_numpy(), window=10))
    out["cycle_age"] = out["cycle"]
    return out


def build_model_matrix(feature_df: pd.DataFrame) -> pd.DataFrame:
    missing = [c for c in MODEL_FEATURE_COLUMNS if c not in feature_df.columns]
    if missing:
        raise ValueError(f"Missing frozen model features: {missing}")
    X = feature_df[MODEL_FEATURE_COLUMNS].copy()
    return X
