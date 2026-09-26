from pathlib import Path
import pandas as pd

COLUMNS = (
    ["unit_id", "cycle"]
    + [f"setting_{i}" for i in range(1, 4)]
    + [f"sensor_{i}" for i in range(1, 22)]
)


def load_fd001(data_dir: str | Path):
    data_dir = Path(data_dir)
    train = pd.read_csv(data_dir / "train_FD001.txt", sep=r"\s+", header=None, names=COLUMNS)
    test = pd.read_csv(data_dir / "test_FD001.txt", sep=r"\s+", header=None, names=COLUMNS)
    rul = pd.read_csv(data_dir / "RUL_FD001.txt", sep=r"\s+", header=None, names=["RUL"])
    return train, test, rul
