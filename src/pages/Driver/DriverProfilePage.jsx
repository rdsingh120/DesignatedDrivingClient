// src/pages/Driver/DriverProfilePage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  apiGetMyDriverProfile,
  apiUpdateMyDriverProfile,
  apiUploadDriverPhoto,
} from "../../api/driverClient";

import { colors, pageStyle, cardStyle, inputStyle, btn } from "../../styles/theme";
import DriverNavBar from "../../components/DriverNavBar";

export default function DriverProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    phoneNumber: "",
    licenseNumber: "",
    licenseExpiry: "",
    dateOfBirth: "",
    street: "",
    city: "",
  });

  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

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
          street: p.address?.street || "",
          city: p.address?.city || "",
        });

        if (p.profilePhoto) {
          setPhotoPreview(`${import.meta.env.VITE_API_BASE_URL}${p.profilePhoto}`);
        }
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

  function onPhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);

    try {
      if (photo) {
        await apiUploadDriverPhoto(photo);
      }

      await apiUpdateMyDriverProfile({
        phoneNumber: form.phoneNumber,
        licenseNumber: form.licenseNumber,
        licenseExpiry: form.licenseExpiry,
        dateOfBirth: form.dateOfBirth,
        address: {
          street: form.street,
          city: form.city,
        },
      });

      navigate("/driver", { replace: true });
    } catch (err) {
      console.log(err.message || "Update failed");
    }

    setSaving(false);
  }

  return (
    <div style={pageStyle}>
      <DriverNavBar />
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

        <p style={{ margin: "6px 0 0", color: colors.textMuted, fontSize: 14 }}>
          Complete your driver profile before requesting verification.
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
        <div style={cardStyle}>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            {/* Profile Photo */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 10,
                marginBottom: 16,
              }}
            >
              <label
                htmlFor="driver-photo"
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "50%",
                  overflow: "hidden",
                  background: photoPreview ? "transparent" : colors.bgBase,
                  border: `2px dashed ${colors.border}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {photoPreview ? (
                  <img
                    src={photoPreview}
                    alt="Driver"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <span style={{ fontSize: 28, color: colors.textMuted }}>📷</span>
                )}
              </label>

              <input
                id="driver-photo"
                type="file"
                accept="image/*"
                onChange={onPhotoChange}
                style={{ display: "none" }}
              />

              <label
                htmlFor="driver-photo"
                style={{
                  padding: "6px 14px",
                  borderRadius: 8,
                  border: `1px solid ${colors.border}`,
                  fontSize: 13,
                  cursor: "pointer",
                  color: colors.textSecondary,
                }}
              >
                {photoPreview ? "Change Photo" : "Upload Photo"}
              </label>
            </div>

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
