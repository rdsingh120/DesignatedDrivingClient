import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchMyVehicles,
  createVehicle,
  deleteVehicle,
} from "../../features/vehicles/vehiclesSlice";

export default function RiderVehiclesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const vehicles = useAppSelector((s) => s.vehicles.items);
  const status = useAppSelector((s) => s.vehicles.loading ? "loading" : "idle");
  const error = useAppSelector((s) => s.vehicles.error);

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    color: "",
    plateNumber: "",
    vin: "",
  });

  useEffect(() => {
    dispatch(fetchMyVehicles());
  }, [dispatch]);

  function onChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function onCreate(e) {
    e.preventDefault();

    const payload = {
      ...form,
      year: Number(form.year),
    };

    const result = await dispatch(createVehicle(payload));

    if (createVehicle.fulfilled.match(result)) {
      setForm({
        make: "",
        model: "",
        year: "",
        color: "",
        plateNumber: "",
        vin: "",
      });
    }
  }

  async function onDelete(id) {
    await dispatch(deleteVehicle(id));
  }

  function onSelect(vehicleId) {
    navigate(`/rider/request?vehicleId=${vehicleId}`);
  }

  return (
    <div style={{ padding: 20, maxWidth: 900, margin: "0 auto" }}>
      <h2>My Vehicles</h2>

      {error && (
        <div style={{ background: "#fee", padding: 10, marginBottom: 12 }}>
          {String(error)}
        </div>
      )}

      <div style={{ display: "grid", gap: 10 }}>
        {status === "loading" && <div>Loading…</div>}

        {vehicles.map((v) => (
          <div
            key={v._id}
            style={{
              border: "1px solid #ddd",
              padding: 12,
              borderRadius: 8,
            }}
          >
            <div style={{ fontWeight: 600 }}>
              {v.year} {v.make} {v.model} ({v.color || "—"})
            </div>
            <div>Plate: {v.plateNumber}</div>

            <div style={{ marginTop: 10, display: "flex", gap: 10 }}>
              <button onClick={() => onSelect(v._id)}>
                Use this vehicle
              </button>
              <button onClick={() => onDelete(v._id)}>
                Remove
              </button>
            </div>
          </div>
        ))}

        {vehicles.length === 0 && status !== "loading" && (
          <div>No vehicles yet.</div>
        )}
      </div>

      <hr style={{ margin: "20px 0" }} />

      <h3>Add Vehicle</h3>

      <form
        onSubmit={onCreate}
        style={{ display: "grid", gap: 8, maxWidth: 420 }}
      >
        <input
          name="make"
          value={form.make}
          onChange={onChange}
          placeholder="Make (required)"
          required
        />
        <input
          name="model"
          value={form.model}
          onChange={onChange}
          placeholder="Model (required)"
          required
        />
        <input
          name="year"
          value={form.year}
          onChange={onChange}
          placeholder="Year (required)"
          required
        />
        <input
          name="color"
          value={form.color}
          onChange={onChange}
          placeholder="Color"
        />
        <input
          name="plateNumber"
          value={form.plateNumber}
          onChange={onChange}
          placeholder="Plate Number (required)"
          required
        />
        <input
          name="vin"
          value={form.vin}
          onChange={onChange}
          placeholder="VIN"
        />

        <button disabled={status === "loading"}>
        {status === "loading" ? "Working…" : "Create vehicle"}
        </button>
      </form>
    </div>
  );
}