# Aerohealth API

## Run locally

From the repository root, activate the existing environment and install the project requirements:

~~~bash
source .venv/bin/activate
python -m pip install -r requirements.txt
python -m uvicorn app.backend.main:app --host 127.0.0.1 --port 8000
~~~

The API is available at http://localhost:8000. Interactive API documentation is at /docs.

## Health check

GET /api/health returns 200 with status "ok" and model_loaded true when the saved model loads. If model loading fails, the API remains available for diagnosis and returns 503 with status "degraded" and model_loaded false. Server logs record the startup failure without exposing details in the response.

## Configuration

All paths are resolved relative to the repository root unless an absolute path is supplied.

- AEROHEALTH_MODEL_PATH: saved model file. Defaults to models/aerohealth_lgbm_quantile_alpha_040.joblib.
- AEROHEALTH_DATA_DIR: FD001 data directory. Defaults to data/raw.
- AEROHEALTH_ALLOWED_ORIGINS: comma-separated frontend origins. Defaults to http://localhost:3000,http://127.0.0.1:3000. Wildcard origins are rejected.
- AEROHEALTH_ENVIRONMENT: environment name, default development.

## Available endpoints

- GET /api/health
- GET /api/engines
- GET /api/engines/{engine_id}
- GET /api/engines/{engine_id}/prediction
- GET /api/engines/{engine_id}/trajectory?sensor=sensor_2
- GET /api/research/summary
- GET /api/research/methodology

Engine identifiers and trajectory values come from the actual FD001 test trajectories. The variable sensor list is sourced from the frozen model feature definition. Prediction values are prepared with the existing research inference function. Responses identify predictions as model estimates and the dataset as a simulated benchmark.

Research summary values are reference-run results from the canonical notebook audit. Methodology metadata is sourced from the frozen feature and model configuration. These endpoints report research evidence and do not represent live inference.
