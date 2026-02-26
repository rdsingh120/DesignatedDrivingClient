import { useEffect, useRef } from "react";
import { useAppDispatch } from "../../app/hooks";
import { fetchTripById } from "./tripsSlice";

export function useTripPolling(tripId, { enabled = true, intervalMs = 2500, stopOn = ["COMPLETED"] } = {}) {
  const dispatch = useAppDispatch();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!tripId || !enabled) return;

    let cancelled = false;

    async function tick() {
      const result = await dispatch(fetchTripById({ tripId }));
      const trip = result.payload?.trip;

      if (!cancelled && trip?.status && stopOn.includes(String(trip.status).toUpperCase())) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }

    tick();
    timerRef.current = setInterval(tick, intervalMs);

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [tripId, enabled, intervalMs, dispatch, stopOn]);
}