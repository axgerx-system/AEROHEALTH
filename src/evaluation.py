import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error


def phm08_score(y_true, y_pred):
    errors = np.asarray(y_pred) - np.asarray(y_true)
    return float(np.sum(np.where(
        errors < 0,
        np.exp(-errors / 13) - 1,
        np.exp(errors / 10) - 1,
    )))


def regression_metrics(y_true, y_pred):
    return {
        "MAE": float(mean_absolute_error(y_true, y_pred)),
        "RMSE": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "PHM08": phm08_score(y_true, y_pred),
    }
