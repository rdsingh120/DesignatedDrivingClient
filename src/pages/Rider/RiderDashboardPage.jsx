import React from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectUser } from "../../features/auth/authSlice";
import { Car, Clock, LogOut, MapPin, User } from "lucide-react";

export default function RiderDashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", color: "#f1f5f9", fontFamily: "system-ui, sans-serif" }}>

      {/* Header */}
      <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 24px", borderBottom: "1px solid #334155" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: "50%", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <User size={20} color="#fff" />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>Welcome back</p>
            <p style={{ margin: 0, fontWeight: 600, fontSize: 15 }}>{user?.name || "Rider"}</p>
          </div>
        </div>

        <button
          onClick={() => dispatch(logout())}
          style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "1px solid #334155", color: "#94a3b8", padding: "8px 14px", borderRadius: 8, cursor: "pointer", fontSize: 14, transition: "all 0.15s" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "#f1f5f9"; e.currentTarget.style.borderColor = "#64748b"; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.borderColor = "#334155"; }}
        >
          <LogOut size={16} />
          Sign out
        </button>
      </header>

      {/* Hero */}
      <section style={{ padding: "48px 24px 32px" }}>
        <p style={{ margin: "0 0 6px", fontSize: 13, color: "#6366f1", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Rider Dashboard</p>
        <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700, lineHeight: 1.2 }}>Where to today?</h1>
        <p style={{ margin: "10px 0 0", color: "#94a3b8", fontSize: 15 }}>Book a safe, reliable designated driver in minutes.</p>
      </section>

      {/* Quick action cards */}
      <section style={{ padding: "0 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>

        {/* Book a Ride */}
        <Link
          to="/rider/vehicles"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)", borderRadius: 16, padding: 24, boxShadow: "0 8px 32px rgba(99,102,241,0.3)", cursor: "pointer", transition: "transform 0.15s, box-shadow 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 12px 40px rgba(99,102,241,0.45)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(99,102,241,0.3)"; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Car size={24} color="#fff" />
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#fff" }}>Book a Ride</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#c7d2fe" }}>Select a vehicle and request a driver</p>
          </div>
        </Link>

        {/* My Vehicles */}
        <Link
          to="/rider/vehicles"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 24, cursor: "pointer", transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#6366f1"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <MapPin size={24} color="#10b981" />
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>My Vehicles</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>Add or manage your registered vehicles</p>
          </div>
        </Link>

        {/* Trip History */}
        <Link
          to="/rider/history"
          style={{ textDecoration: "none" }}
        >
          <div
            style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: 16, padding: 24, cursor: "pointer", transition: "transform 0.15s, border-color 0.15s, box-shadow 0.15s" }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.borderColor = "#f59e0b"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "#334155"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(245,158,11,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
              <Clock size={24} color="#f59e0b" />
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 700, color: "#f1f5f9" }}>Trip History</h2>
            <p style={{ margin: 0, fontSize: 13, color: "#64748b" }}>View all your past rides</p>
          </div>
        </Link>

      </section>

      {/* Info strip */}
      <section style={{ margin: "40px 24px 0", padding: 20, background: "#1e293b", border: "1px solid #334155", borderRadius: 16, display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(99,102,241,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <Car size={18} color="#6366f1" />
        </div>
        <div>
          <p style={{ margin: 0, fontWeight: 600, fontSize: 14, color: "#f1f5f9" }}>How it works</p>
          <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748b" }}>
            Add a vehicle &rarr; Get a fare estimate &rarr; A designated driver is assigned to you &rarr; Arrive safely.
          </p>
        </div>
      </section>

    </div>
  );
}
