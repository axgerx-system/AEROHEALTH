const API_BASE = (process.env.NEXT_PUBLIC_AEROHEALTH_API_URL || "http://localhost:8000").replace(/\/$/, "");

export type Resource<T> = { status: "loading" | "success" | "empty" | "error"; data: T | null; error: string | null };
export type Health = { status: "ok" | "degraded"; service: string; model_loaded: boolean };
export type Engine = { engine_id: number; current_cycle: number; observed_cycles: number };
export type EngineList = { dataset: string; count: number; engines: Engine[] };
export type EngineDetail = Engine & { dataset: string; data_type: "simulated_benchmark"; available_sensors: string[] };
export type ModelMetadata = { model_type: string; objective: string; alpha: number; feature_count: number };
export type Prediction = { engine_id: number; current_cycle: number; estimated_rul: number; estimate_type: "model_estimate"; dataset: string; model: ModelMetadata };
export type Trajectory = { engine_id: number; dataset: string; sensor: string; current_cycle: number; observed_cycles: number; prediction_context: { estimated_rul: number; estimate_type: "model_estimate" } | null; points: { cycle: number; value: number }[] };
export type MetricSet = { mae: number; rmse: number; phm08: number };
export type ResearchSummary = { dataset: string; feature_count: number; validation: MetricSet; official_test: MetricSet; model: { model_type: string; objective: string; alpha: number; n_estimators: number; max_depth: number; num_leaves: number; learning_rate: number; subsample: number; colsample_bytree: number; random_state: number } };
export type Methodology = { dataset: string; data_type: "simulated_benchmark"; target_definition: string; target_note: string; excluded_features: string[]; official_test_protocol: string; feature_count: number; feature_families: { name: string; count: number; description: string }[]; variable_sensors: string[]; excluded_constant_sensors: string[]; split: { strategy: string; train_engines: number; validation_engines: number; random_state: number }; model: ResearchSummary["model"]; evaluation_metrics: { name: string; description: string; unit: string | null }[]; limitations: string[] };

async function request<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, { headers: { Accept: "application/json" }, cache: "no-store", signal });
  if (!response.ok) {
    let message = `Request failed (${response.status})`;
    try { const body = await response.json(); message = body?.error?.message || message; } catch { /* keep the status-based message */ }
    throw new Error(message);
  }
  return response.json() as Promise<T>;
}

export const aerohealthApi = {
  health: (signal?: AbortSignal) => request<Health>("/api/health", signal),
  engines: (signal?: AbortSignal) => request<EngineList>("/api/engines", signal),
  engine: (id: number, signal?: AbortSignal) => request<EngineDetail>(`/api/engines/${id}`, signal),
  prediction: (id: number, signal?: AbortSignal) => request<Prediction>(`/api/engines/${id}/prediction`, signal),
  trajectory: (id: number, sensor: string, signal?: AbortSignal) => request<Trajectory>(`/api/engines/${id}/trajectory?sensor=${encodeURIComponent(sensor)}`, signal),
  summary: (signal?: AbortSignal) => request<ResearchSummary>("/api/research/summary", signal),
  methodology: (signal?: AbortSignal) => request<Methodology>("/api/research/methodology", signal),
};
