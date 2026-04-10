// src/pages/Rider/ReportIssuePage.jsx

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { fetchTripById, clearCurrentTrip } from "../../features/trips/tripsSlice";
import { apiReportIssue } from "../../api/client";
import {
  colors, pageStyle, btn, errorBanner, textareaStyle,
  backBtn, detailCard as card, fieldLabel as sectionLabel,
} from "../../styles/theme";

const ISSUE_TYPES = [
  { value: "SAFETY",         label: "Safety Concern" },
  { value: "VEHICLE_DAMAGE", label: "Vehicle Damage" },
  { value: "ROUTE_ISSUE",    label: "Route Issue" },
  { value: "PAYMENT_ISSUE",  label: "Payment Issue" },
  { value: "OTHER",          label: "Other" },
];

// ─── Left column: Trip context card ──────────────────────────────────────────

function TripContextCard({ trip }) {
  const pickup  = trip.pickup_display_address  || trip.pickup_address  || "—";
  const dropoff = trip.dropoff_display_address || trip.dropoff_address || "—";
  const fare    = trip.fare_amount != null ? `${trip.fare_amount} ${trip.currency || "CAD"}` : "—";
  const date    = trip.completedAt
    ? new Date(trip.completedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : "—";
  const driverName = trip.driverProfile?.user?.name || "—";

  const metaRows = [
    { icon: "👤", label: "Driver", value: driverName },
    { icon: "💰", label: "Fare",   value: fare       },
    { icon: "🕐", label: "Date",   value: date       },
  ];

  return (
    <div style={card}>
      <p style={{ ...sectionLabel, marginBottom: 16 }}>Trip Summary</p>

      {/* Route with vertical connector */}
      <div style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: `1px solid ${colors.borderSubtle}` }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 3, flexShrink: 0 }}>
          <div style={{ width: 10, height: 10, borderRadius: "50%", border: `2px solid ${colors.primary}`, background: "transparent" }} />
          <div style={{ width: 2, flex: 1, background: colors.border, margin: "3px 0" }} />
          <div style={{ width: 10, height: 10, borderRadius: 2, background: colors.successLight }} />
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, minWidth: 0 }}>
          <div>
            <p style={{ margin: "0 0 1px", fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Pickup</p>
            <p style={{ margin: 0, fontSize: 13, color: colors.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pickup}</p>
          </div>
          <div>
            <p style={{ margin: "0 0 1px", fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>Dropoff</p>
            <p style={{ margin: 0, fontSize: 13, color: colors.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{dropoff}</p>
          </div>
        </div>
      </div>

      {/* Remaining rows */}
      {metaRows.map((r, i) => (
        <div
          key={r.label}
          style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            padding: "10px 0",
            borderBottom: i < metaRows.length - 1 ? `1px solid ${colors.borderSubtle}` : "none",
          }}
        >
          <span style={{ fontSize: 15, marginTop: 1, flexShrink: 0, width: 20, textAlign: "center" }}>
            {r.icon}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: "0 0 1px", fontSize: 11, color: colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {r.label}
            </p>
            <p style={{ margin: 0, fontSize: 13, color: colors.textSecondary, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {r.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Page header ──────────────────────────────────────────────────────────────

function PageHeader({ onBack }) {
  return (
    <div style={{ borderBottom: `1px solid ${colors.borderSubtle}`, padding: "0 32px", marginBottom: 32 }}>
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "20px 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button onClick={onBack} style={backBtn}>← Trip</button>
        <span style={{ color: colors.textFaint, fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: colors.textSecondary }}>Report an Issue</span>
      </div>
      <div style={{ maxWidth: 980, margin: "0 auto", paddingBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: colors.textPrimary }}>Report an Issue</h1>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: colors.textMuted }}>
          Describe the issue so our team can review and resolve it.
        </p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReportIssuePage() {
  const { tripId } = useParams();
  const dispatch   = useAppDispatch();
  const navigate   = useNavigate();

  const [type, setType]           = useState("OTHER");
  const [description, setDescription] = useState("");
  const [severity, setSeverity]   = useState(3);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]         = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const trip        = useAppSelector((s) => s.trips.current);
  const tripLoading = useAppSelector((s) => s.trips.loading || s.trips.polling);

  useEffect(() => {
    dispatch(clearCurrentTrip());
    dispatch(fetchTripById(tripId));
  }, [dispatch, tripId]);

  const handleSubmit = async () => {
    setError(null);
    if (description.trim().length < 10) {
      setError("Please enter at least 10 characters in the description.");
      return;
    }
    setSubmitting(true);
    try {
      await apiReportIssue(tripId, { type, description: description.trim(), severity });
      setSubmitted(true);
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Success ──
  if (submitted) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 480, padding: "0 32px" }}>
          <div style={{ ...card, textAlign: "center", padding: "64px 32px" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>✅</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Report submitted</h2>
            <p style={{ margin: "0 0 32px", fontSize: 15, color: colors.textMuted }}>
              Our team will review your report and follow up if needed.
            </p>
            <button
              style={{ ...btn.primary, padding: "12px 40px", fontSize: 15 }}
              onClick={() => navigate(`/rider/trip/${tripId}`)}
            >
              Back to Trip
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Loading ──
  if (tripLoading || !trip) {
    return (
      <div style={pageStyle}>
        <PageHeader onBack={() => navigate(-1)} />
        <div style={{ maxWidth: 900, margin: "40px auto", padding: "0 32px" }}>
          <div style={{ ...card, textAlign: "center", padding: "60px 24px" }}>
            <p style={{ margin: 0, color: colors.textMuted, fontSize: 15 }}>Loading trip details…</p>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ──
  return (
    <div style={pageStyle}>
      <PageHeader onBack={() => navigate(`/rider/trip/${tripId}`)} />

      <div style={{ maxWidth: 980, margin: "0 auto", padding: "0 32px 60px", display: "flex", gap: 24 }}>

        {/* ── Left column: trip context ── */}
        <div style={{ flex: "0 0 320px", minWidth: 260 }}>
          <TripContextCard trip={trip} />
        </div>

        {/* ── Right column: form ── */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column" }}>

          {/* Issue type */}
          <div style={card}>
            <p style={{ ...sectionLabel, marginBottom: 12 }}>Issue Type</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {ISSUE_TYPES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setType(value)}
                  style={{
                    padding: "10px 14px",
                    borderRadius: 8,
                    border: `1.5px solid ${type === value ? colors.primary : colors.border}`,
                    background: type === value ? "rgba(99,102,241,0.12)" : "transparent",
                    color: type === value ? colors.primaryLight : colors.textSecondary,
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.1s",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div style={card}>
            <p style={{ ...sectionLabel, marginBottom: 4 }}>Severity</p>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: colors.textMuted }}>
              1 = Minor inconvenience · 5 = Serious safety issue
            </p>
            <div style={{ display: "flex", gap: 8 }}>
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  onClick={() => setSeverity(s)}
                  style={{
                    flex: 1,
                    padding: "10px 0",
                    borderRadius: 8,
                    border: `1.5px solid ${severity === s ? colors.primary : colors.border}`,
                    background: severity === s ? "rgba(99,102,241,0.12)" : "transparent",
                    color: severity === s ? colors.primaryLight : colors.textSecondary,
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: "pointer",
                    transition: "all 0.1s",
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ ...card, flex: 1, marginBottom: 16, display: "flex", flexDirection: "column" }}>
            <p style={{ ...sectionLabel, marginBottom: 4 }}>Description</p>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: colors.textMuted }}>
              Please describe what happened in detail.
            </p>
            <textarea
              placeholder="What happened? Include as much detail as possible…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={3000}
              style={{ ...textareaStyle, flex: 1, minHeight: 120 }}
            />
            <p style={{ margin: "5px 0 0", fontSize: 11, color: colors.textMuted, textAlign: "right" }}>
              {description.length} / 3000
            </p>
          </div>

          {/* Error */}
          {error && (
            <div style={{ ...errorBanner, marginBottom: 16 }}>{error}</div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{ ...btn.primary, padding: "12px 32px", fontSize: 15, opacity: submitting ? 0.6 : 1, minWidth: 160 }}
            >
              {submitting ? "Submitting…" : "Submit Report"}
            </button>
            <button
              style={{ ...btn.ghost, padding: "12px 24px", fontSize: 14 }}
              onClick={() => navigate(`/rider/trip/${tripId}`)}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
