import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchMyTrips } from "../../features/trips/tripsSlice";
import { Link } from "react-router-dom";

export default function RiderTripHistoryPage() {
  const dispatch = useAppDispatch();
  const trips = useAppSelector((s) => s.trips.mine || []);
  const status = useAppSelector((s) => s.trips.status);
  const error = useAppSelector((s) => s.trips.error);

  useEffect(() => {
    dispatch(fetchMyTrips());
  }, [dispatch]);

  return (
    <div style={{ padding: 16 }}>
      <h2>Trip History</h2>

      {status === "loading" && <p>Loading...</p>}
      {error && <p style={{ color: "crimson" }}>{String(error)}</p>}

      {trips.length === 0 && status !== "loading" ? (
        <p>No trips yet.</p>
      ) : (
        <ul>
          {trips.map((t) => (
            <li key={t._id} style={{ marginBottom: 10 }}>
              <div><b>Status:</b> {t.status}</div>
              <div><b>Created:</b> {t.createdAt ? new Date(t.createdAt).toLocaleString() : "—"}</div>
              <div>
                <Link to={`/rider/trip/${t._id}`}>View</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}