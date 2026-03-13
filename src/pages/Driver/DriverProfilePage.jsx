// src/pages/Driver/DriverProfilePage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetMyDriverProfile, apiUpdateMyDriverProfile } from "../../api/driverClient";
import { colors, pageStyle, cardStyle, inputStyle, btn } from "../../styles/theme";

export default function DriverProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phoneNumber: "",
    licenseNumber: "",
    licenseExpiry: "",
    dateOfBirth: "",
    vehicleMake: "",
    vehicleModel: "",
    vehicleYear: "",
    plateNumber: "",
    street: "",
    city: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await apiGetMyDriverProfile();
        const p = res.data?.driverProfile || {};

        setForm({
          phoneNumber: p.phoneNumber || "",
          licenseNumber: p.licenseNumber || "",
          licenseExpiry: p.licenseExpiry?.slice?.(0, 10) || "",
          dateOfBirth: p.dateOfBirth?.slice?.(0, 10) || "",
          vehicleMake: p.vehicle?.make || "",
          vehicleModel: p.vehicle?.model || "",
          vehicleYear: p.vehicle?.year || "",
          plateNumber: p.vehicle?.plateNumber || "",
          street: p.address?.street || "",
          city: p.address?.city || "",
        });
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  function onChange(e) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      await apiUpdateMyDriverProfile({
        phoneNumber: form.phoneNumber,
        licenseNumber: form.licenseNumber,
        licenseExpiry: form.licenseExpiry,
        dateOfBirth: form.dateOfBirth,

        vehicle: {
          make: form.vehicleMake,
          model: form.vehicleModel,
          year: Number(form.vehicleYear),
          plateNumber: form.plateNumber,
        },

        address: {
          street: form.street,
          city: form.city,
        },
      });

      alert("Driver profile submitted for verification");

      navigate("/driver", { replace: true });
    } catch (err) {
      alert(err.message || "Update failed");
    }

    setSaving(false);
  }

  return (
    <div style={pageStyle}>
      {/* Header */}
      <div style={{ padding: "20px 24px 0", marginBottom: 28 }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            color: colors.textSecondary,
            cursor: "pointer",
            fontSize: 14,
            padding: 0,
            marginBottom: 16,
          }}
        >
          ← Back
        </button>

        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>Driver Profile</h2>

        <p
          style={{
            margin: "6px 0 0",
            color: colors.textMuted,
            fontSize: 14,
          }}
        >
          Complete your driver profile before requesting verification.
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
        <div style={cardStyle}>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            {/* Phone */}
            <div>
              <label style={{ fontSize: 13, color: colors.textMuted }}>Phone Number</label>
              <input
                style={inputStyle}
                name="phoneNumber"
                value={form.phoneNumber}
                onChange={onChange}
              />
            </div>

            {/* License */}
            <div>
              <label style={{ fontSize: 13, color: colors.textMuted }}>Driver License Number</label>
              <input
                style={inputStyle}
                name="licenseNumber"
                value={form.licenseNumber}
                onChange={onChange}
              />
            </div>

            <div>
              <label style={{ fontSize: 13, color: colors.textMuted }}>License Expiry</label>
              <input
                style={inputStyle}
                name="licenseExpiry"
                type="date"
                value={form.licenseExpiry}
                onChange={onChange}
              />
            </div>

            {/* DOB */}
            <div>
              <label style={{ fontSize: 13, color: colors.textMuted }}>Date of Birth</label>
              <input
                style={inputStyle}
                name="dateOfBirth"
                type="date"
                value={form.dateOfBirth}
                onChange={onChange}
              />
            </div>

            {/* Vehicle */}
            <h4 style={{ marginTop: 8 }}>Vehicle</h4>

            <input
              style={inputStyle}
              name="vehicleMake"
              placeholder="Make"
              value={form.vehicleMake}
              onChange={onChange}
            />

            <input
              style={inputStyle}
              name="vehicleModel"
              placeholder="Model"
              value={form.vehicleModel}
              onChange={onChange}
            />

            <input
              style={inputStyle}
              name="vehicleYear"
              placeholder="Year"
              value={form.vehicleYear}
              onChange={onChange}
            />

            <input
              style={inputStyle}
              name="plateNumber"
              placeholder="Plate number"
              value={form.plateNumber}
              onChange={onChange}
            />

            {/* Address */}
            <h4 style={{ marginTop: 8 }}>Address</h4>

            <input
              style={inputStyle}
              name="street"
              placeholder="Street"
              value={form.street}
              onChange={onChange}
            />

            <input
              style={inputStyle}
              name="city"
              placeholder="City"
              value={form.city}
              onChange={onChange}
            />

            <button
              style={{
                ...btn.primary,
                marginTop: 8,
                opacity: saving ? 0.7 : 1,
              }}
              disabled={saving}
            >
              {saving ? "Saving…" : "Submit for verification"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
