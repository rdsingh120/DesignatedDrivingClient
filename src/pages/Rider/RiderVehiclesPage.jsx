import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchMyVehicles,
  createVehicle,
  deleteVehicle,
} from "../../features/vehicles/vehiclesSlice";

const pageStyle = {
  minHeight: "100vh",
  background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
  color: "#f1f5f9",
  fontFamily: "system-ui, sans-serif",
  padding: "0 0 60px",
};

const cardStyle = {
  background: "#1e293b",
  border: "1px solid #334155",
  borderRadius: 16,
  padding: 20,
};

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  background: "#0f172a",
  border: "1px solid #334155",
  borderRadius: 8,
  color: "#f1f5f9",
  fontSize: 14,
  boxSizing: "border-box",
  outline: "none",
};

const btnPrimaryStyle = {
  padding: "10px 18px",
  background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
  color: "#fff",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
};

const btnDangerStyle = {
  padding: "10px 18px",
  background: "transparent",
  color: "#f87171",
  border: "1px solid #991b1b",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
};

export default function RiderVehiclesPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const vehicles = useAppSelector((s) => s.vehicles.items);
  const status = useAppSelector((s) => s.vehicles.loading ? "loading" : "idle");
  const error = useAppSelector((s) => s.vehicles.error);

  const [deleteTargetId, setDeleteTargetId] = useState(null);

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

  function onDelete(id) {
    setDeleteTargetId(id);
  }

  async function confirmDelete() {
    await dispatch(deleteVehicle(deleteTargetId));
    setDeleteTargetId(null);
  }

  function onSelect(vehicleId) {
    navigate(`/rider/request?vehicleId=${vehicleId}`);
  }

  return (
    <div style={pageStyle}>

      {/* Header */}
      <div style={{ padding: "20px 24px 0", marginBottom: 28 }}>
        <button
          onClick={() => navigate(-1)}
          style={{ background: "none", border: "none", color: "#94a3b8", cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16 }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>My Vehicles</h2>
        <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>Select a vehicle to book a ride, or add a new one below.</p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {/* Error banner */}
        {error && (
          <div style={{ background: "#450a0a", border: "1px solid #991b1b", padding: "10px 14px", borderRadius: 8, marginBottom: 16, fontSize: 14, color: "#fca5a5" }}>
            {String(error)}
          </div>
        )}

        {/* Vehicle list */}
        <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
          {status === "loading" && (
            <div style={{ ...cardStyle, color: "#64748b", fontSize: 14 }}>Loading…</div>
          )}

          {vehicles.map((v) => (
            <div
              key={v._id}
              style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
            >
              {/* Vehicle info */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
                  🚗
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {v.year} {v.make} {v.model}
                  </div>
                  <div style={{ fontSize: 13, color: "#64748b", marginTop: 2 }}>
                    {v.color ? `${v.color} · ` : ""}{v.plateNumber}
                    {v.vin ? ` · VIN: ${v.vin}` : ""}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button style={btnPrimaryStyle} onClick={() => onSelect(v._id)}>
                  Use this vehicle
                </button>
                <button style={btnDangerStyle} onClick={() => onDelete(v._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          {vehicles.length === 0 && status !== "loading" && (
            <div style={{ ...cardStyle, textAlign: "center", padding: "40px 20px", color: "#64748b" }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🚗</div>
              <p style={{ margin: 0, fontSize: 15 }}>No vehicles yet.</p>
              <p style={{ margin: "6px 0 0", fontSize: 13 }}>Add one below to get started.</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: "1px solid #334155", marginBottom: 28 }} />

        {/* Add vehicle form */}
        <div style={cardStyle}>
          <p style={{ margin: "0 0 16px", fontWeight: 600, fontSize: 14, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Add Vehicle</p>

          <form onSubmit={onCreate} style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 4 }}>Make *</label>
                <input
                  style={inputStyle}
                  name="make"
                  value={form.make}
                  onChange={onChange}
                  placeholder="e.g. Toyota"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 4 }}>Model *</label>
                <input
                  style={inputStyle}
                  name="model"
                  value={form.model}
                  onChange={onChange}
                  placeholder="e.g. Camry"
                  required
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 4 }}>Year *</label>
                <input
                  style={inputStyle}
                  name="year"
                  value={form.year}
                  onChange={onChange}
                  placeholder="e.g. 2020"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 4 }}>Color</label>
                <input
                  style={inputStyle}
                  name="color"
                  value={form.color}
                  onChange={onChange}
                  placeholder="e.g. Silver"
                />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 4 }}>Plate Number *</label>
                <input
                  style={inputStyle}
                  name="plateNumber"
                  value={form.plateNumber}
                  onChange={onChange}
                  placeholder="e.g. ABCD 123"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: 13, color: "#64748b", display: "block", marginBottom: 4 }}>VIN</label>
                <input
                  style={inputStyle}
                  name="vin"
                  value={form.vin}
                  onChange={onChange}
                  placeholder="e.g. 1HGBH41JXMN109186"

                />
              </div>
            </div>

            <button
              style={{ ...btnPrimaryStyle, marginTop: 4, opacity: status === "loading" ? 0.6 : 1 }}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Working…" : "Create vehicle"}
            </button>
          </form>
        </div>

      </div>

      {/* Delete confirmation modal */}
      {deleteTargetId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50 }}>
          <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 28, maxWidth: 360, width: "90%", boxShadow: "0 24px 64px rgba(0,0,0,0.5)" }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(239,68,68,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 22 }}>
              ⚠️
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>Remove vehicle?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: "#64748b", lineHeight: 1.5 }}>
              This vehicle will be permanently removed. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={{ flex: 1, padding: "10px 0", background: "transparent", border: "1px solid #334155", borderRadius: 8, color: "#94a3b8", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                onClick={() => setDeleteTargetId(null)}
              >
                Cancel
              </button>
              <button
                style={{ flex: 1, padding: "10px 0", background: "#dc2626", border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                onClick={confirmDelete}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
