import { Link } from "react-router-dom";
import { Car, Clock, MapPin, User } from "lucide-react";
import { colors, alpha, gradients } from "../../styles/theme";

export default function RiderDashboardPage() {

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

            <p
              style={{
                margin: 0,
                fontSize: 13,
                color: colors.textMuted,
              }}
            >
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
            Add a vehicle &rarr; Get a fare estimate &rarr; A designated driver is assigned to you
            &rarr; Arrive safely.
          </p>
        </div>
      </section>
    </div>
  );
}
