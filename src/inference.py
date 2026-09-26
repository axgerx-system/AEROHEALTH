from pathlib import Path
import joblib
import pandas as pd

from .features import engineer_features, build_model_matrix


def prepare_engine_history(df: pd.DataFrame):
    features = engineer_features(df)
    X = build_model_matrix(features)
    return features, X


def predict_last_cycle(model, df: pd.DataFrame) -> pd.DataFrame:
    features, X = prepare_engine_history(df)
    predictions = model.predict(X)
    work = features[["unit_id", "cycle"]].copy()
    work["predicted_RUL"] = predictions
    return (
        work.sort_values(["unit_id", "cycle"])
        .groupby("unit_id", as_index=False)
        .tail(1)
        .sort_values("unit_id")
        .reset_index(drop=True)
    )

def save_model(model, path: str | Path):
    path = Path(path)
    path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, path)


def load_model(path: str | Path):
    return joblib.load(path)

if __name__ == "__main__":
    project_root = Path(__file__).resolve().parents[1]
    model_path = project_root / "models" / "aerohealth_lgbm_quantile_alpha_040.joblib"
    test_path = project_root / "data" / "raw" / "test_FD001.txt"

    print("=" * 50)
    print("             AEROHEALTH")
    print("     Predictive Maintenance Intelligence")
    print("=" * 50)

    model = load_model(model_path)

    columns = [
        "unit_id", "cycle",
        "setting_1", "setting_2", "setting_3",
        *[f"sensor_{i}" for i in range(1, 22)]
    ]

    df = pd.read_csv(
        test_path,
        sep=r"\s+",
        engine="python",
        header=None,
        names=columns,
    )

    results = predict_last_cycle(model, df)

    print(f"Engines evaluated: {len(results)}")
    print()
    print("Latest RUL predictions:")
    print(results.to_string(index=False))
    print("=" * 50)
