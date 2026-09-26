from lightgbm import LGBMRegressor

FINAL_MODEL_CONFIG = dict(
    n_estimators=300,
    max_depth=-1,
    num_leaves=31,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="quantile",
    alpha=0.40,
    random_state=42,
    n_jobs=1,
    verbosity=-1,
    force_col_wise=True,
)


def create_final_model():
    return LGBMRegressor(**FINAL_MODEL_CONFIG)
