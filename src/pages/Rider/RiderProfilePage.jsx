import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetMyProfile, apiUpdateMyProfile } from "../../api/userProfile";
import { colors, pageStyle, cardStyle, inputStyle, btn } from "../../styles/theme";

export default function RiderProfilePage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      const res = await apiGetMyProfile();
      setForm({
        name: res.data.name || "",
        email: res.data.email || "",
        password: "",
      });
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

    await apiUpdateMyProfile({
      name: form.name,
      email: form.email,
      password: form.password || undefined,
    });

    setSaving(false);

    setForm((prev) => ({
      ...prev,
      password: "",
    }));

    alert("Profile updated");
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

        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>My Profile</h2>

        <p
          style={{
            margin: "6px 0 0",
            color: colors.textMuted,
            fontSize: 14,
          }}
        >
          Update your account information.
        </p>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "0 24px" }}>
        <div style={cardStyle}>
          <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
            {/* Name */}
            <div>
              <label
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Name
              </label>

              <input
                style={inputStyle}
                name="name"
                value={form.name}
                onChange={onChange}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                Email
              </label>

              <input
                style={inputStyle}
                name="email"
                value={form.email}
                onChange={onChange}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  fontSize: 13,
                  color: colors.textMuted,
                  display: "block",
                  marginBottom: 4,
                }}
              >
                New Password
              </label>

              <input
                style={inputStyle}
                name="password"
                type="password"
                value={form.password}
                onChange={onChange}
                placeholder="Leave empty to keep current password"
              />
            </div>

            <button
              style={{
                ...btn.primary,
                marginTop: 6,
                opacity: saving ? 0.7 : 1,
              }}
              disabled={saving}
            >
              {saving ? "Saving…" : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
