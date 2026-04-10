import React from "react";
import { Link } from "react-router-dom";
import { Car, Clock, MapPin, User } from "lucide-react";
import { colors, alpha, gradients } from "../../styles/theme";
import {
  apiGetMySavedLocations,
  apiCreateSavedLocation,
  apiUpdateSavedLocation,
} from "../../api/savedLocations";

export default function RiderDashboardPage() {
  //modal state
  const [modalOpen, setModalOpen] = React.useState(false);
  const [activeLabel, setActiveLabel] = React.useState("");
  const [address, setAddress] = React.useState("");
  const [savedLocations, setSavedLocations] = React.useState([]);
  const [loadingLocations, setLoadingLocations] = React.useState(false);

  function handleQuickLocation(label) {
    const list = savedLocations || [];

    setActiveLabel(label);

    const existing = list.find((loc) => loc.label?.toLowerCase() === label.toLowerCase());

    setAddress(existing?.address || "");

    setModalOpen(true);
  }

  React.useEffect(() => {
    loadSavedLocations();
  }, []);

  async function loadSavedLocations() {
    try {
      setLoadingLocations(true);
      const res = await apiGetMySavedLocations();
      console.log("Saved locations API response:", res);
      setSavedLocations(res?.data?.data || res?.data || res || []);
    } catch (err) {
      console.error("Failed to load locations", err);
    } finally {
      setLoadingLocations(false);
    }
  }

  return (
    <div
      style={{
        color: colors.textPrimary,
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Hero */}
      <section style={{ padding: "48px 24px 32px" }}>
        <p
          style={{
            margin: "0 0 6px",
            fontSize: 13,
            color: colors.primary,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Rider Dashboard
        </p>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>
          Where to today?
        </h1>
        <p style={{ margin: "10px 0 0", color: colors.textSecondary, fontSize: 15 }}>
          Book a safe, reliable designated driver in minutes.
        </p>
      </section>

      {/* Quick Locations */}
      <div style={{ padding: "0 24px 16px", display: "flex", gap: 10, flexWrap: "wrap" }}>
        {[
          { label: "Home", icon: "🏠" },
          { label: "Work", icon: "💼" },
          { label: "Gym", icon: "🏋️" },
        ].map((item) => (
          <button
            key={item.label}
            style={{
              padding: "10px 14px",
              borderRadius: 999,
              border: `1px solid ${colors.border}`,
              background: colors.bgBase,
              color: colors.textPrimary,
              cursor: "pointer",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onClick={() => handleQuickLocation(item.label)}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </div>

      {/* Quick action cards */}
      <section
        style={{
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}
      >
        {/* Book a Ride */}
        <Link to="/rider/request" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: gradients.primary,
              borderRadius: 16,
              padding: 24,
              boxShadow: `0 8px 32px ${alpha.primary30}`,
              cursor: "pointer",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = `0 12px 40px ${alpha.primary40}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = `0 8px 32px ${alpha.primary30}`;
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: alpha.white15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Car size={24} color="#fff" />
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#fff" }}>
              Book a Ride
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: colors.primaryPale }}>
              Select a vehicle and request a driver
            </p>
          </div>
        </Link>

        {/* My Vehicles */}
        <Link to="/rider/vehicles" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: colors.bgBase,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: 24,
              cursor: "pointer",
              transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: alpha.success15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <MapPin size={24} color={colors.success} />
            </div>
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: 18,
                fontWeight: 700,
                color: colors.textPrimary,
              }}
            >
              My Vehicles
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>
              Add or manage your registered vehicles
            </p>
          </div>
        </Link>

        {/* Trip History */}
        <Link to="/rider/history" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: colors.bgBase,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: 24,
              cursor: "pointer",
              transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = colors.warning;
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: alpha.warning15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <Clock size={24} color={colors.warning} />
            </div>
            <h2
              style={{
                margin: "0 0 6px",
                fontSize: 18,
                fontWeight: 700,
                color: colors.textPrimary,
              }}
            >
              Trip History
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>
              View all your past rides
            </p>
          </div>
        </Link>

        {/* Profile */}
        <Link to="/rider/profile" style={{ textDecoration: "none" }}>
          <div
            style={{
              background: colors.bgBase,
              border: `1px solid ${colors.border}`,
              borderRadius: 16,
              padding: 24,
              cursor: "pointer",
              transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.borderColor = colors.primary;
              e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.borderColor = colors.border;
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: alpha.primary15,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <User size={24} color={colors.primary} />
            </div>

            <h2
              style={{
                margin: "0 0 6px",
                fontSize: 18,
                fontWeight: 700,
                color: colors.textPrimary,
              }}
            >
              Profile
            </h2>

            <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>
              Update your account information
            </p>
          </div>
        </Link>
      </section>

      {/* Info strip */}
      <section
        style={{
          margin: "40px 24px 0",
          padding: 20,
          background: colors.bgBase,
          border: `1px solid ${colors.border}`,
          borderRadius: 16,
          display: "flex",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: alpha.primary15,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Car size={18} color={colors.primary} />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: colors.textPrimary }}>
            How it works
          </p>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: colors.textMuted }}>
            Add a vehicle → Get a fare estimate → A designated driver is assigned to you → Arrive
            safely.
          </p>
        </div>
      </section>

      {/* MODAL */}
      {modalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
          onClick={() => setModalOpen(false)}
        >
          <div
            style={{
              width: "90%",
              maxWidth: 420,
              background: colors.bgBase,
              borderRadius: 16,
              padding: 20,
              border: `1px solid ${colors.border}`,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: "0 0 12px", fontSize: 18 }}>Set {activeLabel} Address</h3>

            <input
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: 12,
                borderRadius: 10,
                border: `1px solid ${colors.border}`,
                background: colors.bgBase,
                color: colors.textPrimary,
                marginBottom: 16,
              }}
              placeholder={`Enter ${activeLabel} address`}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
              <button
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: `1px solid ${colors.border}`,
                  background: colors.bgBase,
                  color: colors.textPrimary,
                  cursor: "pointer",
                }}
                onClick={async () => {
                  try {
                    if (!address || !address.trim()) {
                      alert("Address is required");
                      return;
                    }

                    const payload = {
                      label: activeLabel,
                      address: address.trim(),
                    };

                    const existing = savedLocations.find(
                      (loc) => loc.label?.toLowerCase() === activeLabel.toLowerCase(),
                    );

                    if (existing?._id) {
                      await apiUpdateSavedLocation(existing._id, payload);
                    } else {
                      await apiCreateSavedLocation(payload);
                    }

                    await loadSavedLocations();
                    setModalOpen(false);
                  } catch (err) {
                    console.error("Failed to update location", err);
                  }
                }}
              >
                Update
              </button>

              <button
                style={{
                  padding: "10px 14px",
                  borderRadius: 10,
                  border: "none",
                  background: colors.primary,
                  color: "#fff",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  try {
                    const existing = savedLocations.find(
                      (loc) => loc.label?.toLowerCase() === activeLabel.toLowerCase(),
                    );

                    if (!address || !address.trim()) {
                      alert("Address is required");
                      return;
                    }

                    const payload = {
                      label: activeLabel,
                      address: address.trim(),
                    };

                    if (existing?._id) {
                      await apiUpdateSavedLocation(existing._id, payload);
                    } else {
                      await apiCreateSavedLocation(payload);
                    }

                    window.location.href = `/rider/request?quick=${activeLabel}&address=${encodeURIComponent(address)}`;
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                GO
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
