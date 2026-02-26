// src/hooks/useTripPolling.js
import { useEffect, useRef } from "react";
import { useAppDispatch } from "../app/hooks";
import { fetchTripById } from "../features/trips/tripsSlice";

export function useTripPolling(tripId, stopWhenStatus = "COMPLETED", intervalMs = 2500) {
  const dispatch = useAppDispatch();
  const timerRef = useRef(null);

  useEffect(() => {
    if (!tripId) return;

    let cancelled = false;

    const tick = async () => {
      if (cancelled) return;

      const action = await dispatch(fetchTripById({ tripId }));
      const payload = action?.payload;

      // Your thunk returns { success, trip } so trip is here:
      const trip = payload?.trip || payload;

      if (trip?.status === stopWhenStatus) {
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
  }, [dispatch, tripId, stopWhenStatus, intervalMs]);
}