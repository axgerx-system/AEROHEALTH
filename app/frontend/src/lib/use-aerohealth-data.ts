"use client";

import { useCallback, useEffect, useState } from "react";
import { aerohealthApi, type EngineList, type EngineDetail, type Health, type Methodology, type Prediction, type ResearchSummary, type Resource, type Trajectory } from "@/lib/api";

function initial<T>(): Resource<T> { return { status: "loading", data: null, error: null }; }
function useResource<T>(loader: (signal: AbortSignal) => Promise<T>, dependencies: unknown[] = []) {
  const [retry, setRetry] = useState(0);
  const [resource, setResource] = useState<Resource<T>>(initial);
  useEffect(() => {
    const controller = new AbortController();
    loader(controller.signal).then((data) => {
      const record = data && typeof data === "object" ? data as Record<string, unknown> : null;
      const empty = data == null || (Array.isArray(data) && data.length === 0) || (record?.count === 0) || (Array.isArray(record?.points) && record.points.length === 0);
      setResource({ status: empty ? "empty" : "success", data, error: null });
    }).catch((error: unknown) => {
      if (!controller.signal.aborted) setResource({ status: "error", data: null, error: error instanceof Error ? error.message : "Request failed" });
    });
    return () => controller.abort();
    // Dependencies are controlled by each caller so requests only restart for their input or retry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencies, retry]);
  return { ...resource, retry: useCallback(() => setRetry((value) => value + 1), []) };
}

export function useAerohealthData() {
  const [selectedEngine, setSelectedEngine] = useState(1);
  const [selectedSensor, setSelectedSensor] = useState("sensor_2");
  const health = useResource<Health>((signal) => aerohealthApi.health(signal));
  const engines = useResource<EngineList>((signal) => aerohealthApi.engines(signal));
  const summary = useResource<ResearchSummary>((signal) => aerohealthApi.summary(signal));
  const methodology = useResource<Methodology>((signal) => aerohealthApi.methodology(signal));
  const engine = useResource<EngineDetail>((signal) => aerohealthApi.engine(selectedEngine, signal), [selectedEngine]);
  const prediction = useResource<Prediction>((signal) => aerohealthApi.prediction(selectedEngine, signal), [selectedEngine]);
  const trajectory = useResource<Trajectory>((signal) => aerohealthApi.trajectory(selectedEngine, selectedSensor, signal), [selectedEngine, selectedSensor]);

  return { health, engines, summary, methodology, engine, prediction, trajectory, selectedEngine, setSelectedEngine, selectedSensor, setSelectedSensor };
}
