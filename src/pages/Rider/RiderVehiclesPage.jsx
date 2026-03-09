import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import {
  fetchMyVehicles,
  createVehicle,
  deleteVehicle,
} from "../../features/vehicles/vehiclesSlice";
import { colors, alpha, pageStyle, cardStyle, inputStyle, btn, modalOverlay, modalCard, errorBanner } from "../../styles/theme";

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
          style={{ background: "none", border: "none", color: colors.textSecondary, cursor: "pointer", fontSize: 14, padding: 0, marginBottom: 16 }}
        >
          ← Back
        </button>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>My Vehicles</h2>
        <p style={{ margin: "6px 0 0", color: colors.textMuted, fontSize: 14 }}>Select a vehicle to book a ride, or add a new one below.</p>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>

        {/* Error banner */}
        {error && (
          <div style={{ ...errorBanner, marginBottom: 16 }}>
            {String(error)}
          </div>
        )}

        {/* Vehicle list */}
        <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
          {status === "loading" && (
            <div style={{ ...cardStyle, color: colors.textMuted, fontSize: 14 }}>Loading…</div>
          )}

          {vehicles.map((v) => (
            <div
              key={v._id}
              style={{ ...cardStyle, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}
            >
              {/* Vehicle info */}
              <div style={{ display: "flex", alignItems: "center", gap: 14, flex: 1, minWidth: 0 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: alpha.primary15, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 20 }}>
                  🚗
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 700, fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {v.year} {v.make} {v.model}
                  </div>
                  <div style={{ fontSize: 13, color: colors.textMuted, marginTop: 2 }}>
                    {v.color ? `${v.color} · ` : ""}{v.plateNumber}
                    {v.vin ? ` · VIN: ${v.vin}` : ""}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <button style={btn.primary} onClick={() => onSelect(v._id)}>
                  Use this vehicle
                </button>
                <button style={btn.danger} onClick={() => onDelete(v._id)}>
                  Remove
                </button>
              </div>
            </div>
          ))}

          {vehicles.length === 0 && status !== "loading" && (
            <div style={{ ...cardStyle, textAlign: "center", padding: "40px 20px", color: colors.textMuted }}>
              <div style={{ fontSize: 36, marginBottom: 10 }}>🚗</div>
              <p style={{ margin: 0, fontSize: 15 }}>No vehicles yet.</p>
              <p style={{ margin: "6px 0 0", fontSize: 13 }}>Add one below to get started.</p>
            </div>
          )}
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid ${colors.border}`, marginBottom: 28 }} />

        {/* Add vehicle form */}
        <div style={cardStyle}>
          <p style={{ margin: "0 0 16px", fontWeight: 600, fontSize: 14, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Add Vehicle</p>

          <form onSubmit={onCreate} style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              <div>
                <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>Make *</label>
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
                <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>Model *</label>
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
                <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>Year *</label>
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
                <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>Color</label>
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
                <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>Plate Number *</label>
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
                <label style={{ fontSize: 13, color: colors.textMuted, display: "block", marginBottom: 4 }}>VIN</label>
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
              style={{ ...btn.primary, marginTop: 4, opacity: status === "loading" ? 0.6 : 1 }}
              disabled={status === "loading"}
            >
              {status === "loading" ? "Working…" : "Create vehicle"}
            </button>
          </form>
        </div>

      </div>

      {/* Delete confirmation modal */}
      {deleteTargetId && (
        <div style={modalOverlay}>
          <div style={modalCard}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: alpha.danger15, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontSize: 22 }}>
              ⚠️
            </div>
            <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>Remove vehicle?</h3>
            <p style={{ margin: "0 0 24px", fontSize: 14, color: colors.textMuted, lineHeight: 1.5 }}>
              This vehicle will be permanently removed. This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                style={{ flex: 1, padding: "10px 0", background: "transparent", border: `1px solid ${colors.border}`, borderRadius: 8, color: colors.textSecondary, cursor: "pointer", fontWeight: 600, fontSize: 14 }}
                onClick={() => setDeleteTargetId(null)}
              >
                Cancel
              </button>
              <button
                style={{ flex: 1, padding: "10px 0", background: colors.dangerDark, border: "none", borderRadius: 8, color: "#fff", cursor: "pointer", fontWeight: 600, fontSize: 14 }}
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
