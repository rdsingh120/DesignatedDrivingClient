// src/hooks/useTripPolling.js
import { useEffect, useRef } from "react";
import { useAppDispatch } from "../app/hooks";
import { fetchTripById } from "../features/trips/tripsSlice";

const TERMINAL_STATUSES = ["COMPLETED", "CANCELLED"];

export function useTripPolling(tripId, stopWhenStatus = TERMINAL_STATUSES, intervalMs = 2500) {
  const dispatch = useAppDispatch();
  const timerRef = useRef(null);

  // Normalize to array so callers can pass a string or array
  const stopStatuses = Array.isArray(stopWhenStatus) ? stopWhenStatus : [stopWhenStatus];

  useEffect(() => {
    if (!tripId) return;

    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;

      const action = await dispatch(fetchTripById(tripId));
      const trip = action?.payload;

      if (trip?.status && stopStatuses.includes(trip.status)) {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };

    tick();
    timerRef.current = setInterval(tick, intervalMs);

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = null;
    };
  }, [dispatch, tripId, stopStatuses.join(","), intervalMs]);
}