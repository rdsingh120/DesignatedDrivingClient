import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { submitRating } from "../../features/ratings/ratingsSlice";
import { fetchTripById, clearCurrentTrip } from "../../features/trips/tripsSlice";
import { colors, alpha, gradients, btn, errorBanner } from "../../styles/theme";

// ─── Constants ────────────────────────────────────────────────────────────────

const STAR_LABELS = ["", "Terrible", "Bad", "Okay", "Good", "Amazing"];
const STAR_COLORS = ["", colors.danger, "#f97316", colors.warning, "#84cc16", colors.success];
const TIP_PRESETS = [0, 1, 2, 5];

// ─── Shared styles ────────────────────────────────────────────────────────────

const card = {
  background: colors.bgBase,
  border: `1px solid ${colors.border}`,
  borderRadius: 12,
  padding: 24,
  marginBottom: 16,
};

const sectionLabel = {
  margin: "0 0 4px",
  fontSize: 11,
  fontWeight: 600,
  color: colors.textSecondary,
  textTransform: "uppercase",
  letterSpacing: "0.07em",
};

// ─── Left column: Driver info card ────────────────────────────────────────────

function DriverInfoCard({ driverProfile }) {
  const name = driverProfile?.user?.name || "Your Driver";
  const photo = driverProfile?.profilePhoto;
  const phone = driverProfile?.phoneNumber;
  const apiBase = import.meta.env.VITE_API_BASE_URL || "";

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: "50%",
            overflow: "hidden",
            background: gradients.avatar,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${colors.border}`,
            flexShrink: 0,
          }}
        >
          {photo ? (
            <img
              src={`${apiBase}${photo}`}
              alt={name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            <span style={{ fontSize: 28 }}>👤</span>
          )}
        </div>
        <div>
          <p style={sectionLabel}>Designated Driver</p>
          <p style={{ margin: "2px 0 0", fontSize: 18, fontWeight: 700, color: colors.textPrimary }}>
            {name}
          </p>
          {phone && (
            <p style={{ margin: "2px 0 0", fontSize: 13, color: colors.textMuted }}>{phone}</p>
          )}
          {driverProfile?.ratingCount > 0 ? (
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
              <span style={{ display: "inline-flex", position: "relative", gap: 2 }}>
                {[1, 2, 3, 4, 5].map((s) => <span key={s} style={{ fontSize: 14, color: colors.border, lineHeight: 1 }}>★</span>)}
                <span style={{ position: "absolute", top: 0, left: 0, overflow: "hidden", width: `${(driverProfile.averageRating / 5) * 100}%`, display: "flex", gap: 2, whiteSpace: "nowrap" }}>
                  {[1, 2, 3, 4, 5].map((s) => <span key={s} style={{ fontSize: 14, color: "#f5b50a", lineHeight: 1, flexShrink: 0 }}>★</span>)}
                </span>
              </span>
              <span style={{ fontSize: 13, color: colors.textSecondary, fontWeight: 600 }}>
                {driverProfile.averageRating.toFixed(1)}
              </span>
              <span style={{ fontSize: 12, color: colors.textFaint }}>
                ({driverProfile.ratingCount})
              </span>
            </div>
          ) : (
            <p style={{ margin: "6px 0 0", fontSize: 12, color: colors.textFaint }}>No ratings yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

function YourVehicleCard({ vehicle }) {
  if (!vehicle) return null;
  return (
    <div style={card}>
      <p style={{ ...sectionLabel, marginBottom: 12 }}>Your Vehicle</p>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
            {vehicle.color ? `${vehicle.color} ` : ""}{vehicle.make} {vehicle.model}
          </p>
          {vehicle.year && (
            <p style={{ margin: "3px 0 0", fontSize: 13, color: colors.textMuted }}>{vehicle.year}</p>
          )}
        </div>
        {vehicle.plateNumber && (
          <span
            style={{
              padding: "4px 12px",
              background: alpha.neutral15,
              borderRadius: 6,
              fontSize: 13,
              fontFamily: "monospace",
              fontWeight: 600,
              color: colors.textSecondary,
              border: `1px solid ${colors.border}`,
              letterSpacing: "0.08em",
            }}
          >
            {vehicle.plateNumber}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Left column: Trip summary card ───────────────────────────────────────────

function TripSummaryCard({ trip, style: outerStyle = {} }) {
  const pickup = trip.pickup_display_address || trip.pickup_address || "—";
  const dropoff = trip.dropoff_display_address || trip.dropoff_address || "—";
  const fare = trip.fare_amount != null ? `${trip.fare_amount} ${trip.currency || "CAD"}` : "—";
  const date = trip.completedAt
    ? new Date(trip.completedAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
    : trip.createdAt
      ? new Date(trip.createdAt).toLocaleString([], { dateStyle: "medium", timeStyle: "short" })
      : null;
  const duration = trip.duration_minutes ? `${Math.round(trip.duration_minutes)} min` : null;
  const distance = trip.distance_km ? `${trip.distance_km.toFixed(1)} km` : null;

  const rows = [
    { icon: "📍", label: "Pickup", value: pickup },
    { icon: "🏁", label: "Dropoff", value: dropoff },
    { icon: "💰", label: "Fare", value: fare },
  ];
  if (date) rows.push({ icon: "🕐", label: "Completed", value: [date, duration].filter(Boolean).join(" · ") });
  if (distance) rows.push({ icon: "📏", label: "Distance", value: distance });

  return (
    <div style={{ ...card, ...outerStyle }}>
      <p style={{ ...sectionLabel, marginBottom: 16 }}>Trip Summary</p>
      <div>
        {rows.map((r, i) => (
          <div
            key={r.label}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "10px 0",
              borderBottom: i < rows.length - 1 ? `1px solid ${colors.borderSubtle}` : "none",
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
    </div>
  );
}

// ─── Right column: Star picker ────────────────────────────────────────────────

function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(null);
  const active = hover ?? value;
  const label = STAR_LABELS[active] || "";
  const color = STAR_COLORS[active] || colors.textFaint;

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span
            key={s}
            onClick={() => onChange(s)}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(null)}
            style={{
              fontSize: 36,
              cursor: "pointer",
              color: s <= active ? color : colors.border,
              transition: "color 0.1s, transform 0.1s",
              transform: s === active ? "scale(1.2)" : "scale(1)",
              display: "inline-block",
              lineHeight: 1,
              userSelect: "none",
            }}
          >
            ★
          </span>
        ))}
        {label && (
          <span
            style={{
              marginLeft: 8,
              fontSize: 14,
              fontWeight: 600,
              color: color,
              transition: "color 0.1s",
            }}
          >
            {label}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Right column: Tip selector ───────────────────────────────────────────────

function TipSelector({ value, onChange }) {
  const [customMode, setCustomMode] = useState(false);
  const [customInput, setCustomInput] = useState("");

  const selectPreset = (amount) => {
    setCustomMode(false);
    setCustomInput("");
    onChange(amount);
  };

  const handleCustomChange = (e) => {
    const raw = e.target.value.replace(/[^0-9.]/g, "");
    setCustomInput(raw);
    const parsed = parseFloat(raw);
    onChange(!isNaN(parsed) && parsed >= 0 ? parsed : 0);
  };

  const isPresetActive = (amount) => !customMode && value === amount;

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        {TIP_PRESETS.map((amount) => (
          <button
            key={amount}
            onClick={() => selectPreset(amount)}
            style={{
              flex: 1,
              padding: "9px 0",
              borderRadius: 8,
              border: `1.5px solid ${isPresetActive(amount) ? colors.primary : colors.border}`,
              background: isPresetActive(amount) ? alpha.primary15 : "transparent",
              color: isPresetActive(amount) ? colors.primaryLight : colors.textSecondary,
              fontWeight: 600,
              fontSize: 14,
              cursor: "pointer",
              transition: "all 0.1s",
            }}
          >
            {amount === 0 ? "No tip" : `$${amount}`}
          </button>
        ))}
        <button
          onClick={() => { setCustomMode(true); onChange(0); }}
          style={{
            flex: 1,
            padding: "9px 0",
            borderRadius: 8,
            border: `1.5px solid ${customMode ? colors.primary : colors.border}`,
            background: customMode ? alpha.primary15 : "transparent",
            color: customMode ? colors.primaryLight : colors.textSecondary,
            fontWeight: 600,
            fontSize: 14,
            cursor: "pointer",
            transition: "all 0.1s",
          }}
        >
          Custom
        </button>
      </div>

      {customMode && (
        <div style={{ marginTop: 10, position: "relative" }}>
          <span
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: colors.textSecondary,
              fontSize: 15,
              fontWeight: 600,
              pointerEvents: "none",
            }}
          >
            $
          </span>
          <input
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={customInput}
            onChange={handleCustomChange}
            autoFocus
            style={{
              width: "100%",
              padding: "10px 12px 10px 26px",
              background: colors.bgDeep,
              border: `1.5px solid ${colors.primary}`,
              borderRadius: 8,
              color: colors.textPrimary,
              fontSize: 15,
              fontWeight: 600,
              boxSizing: "border-box",
              outline: "none",
            }}
          />
        </div>
      )}

      {value > 0 && (
        <p style={{ margin: "8px 0 0", fontSize: 13, color: colors.successLight }}>
          Tipping ${value.toFixed(2)} — your driver will appreciate it!
        </p>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const pageStyle = {
  minHeight: "100vh",
  background: `linear-gradient(160deg, ${colors.bgDeep} 0%, ${colors.bgBase} 100%)`,
  color: colors.textPrimary,
  fontFamily: "system-ui, sans-serif",
};

export default function RateTripPage() {
  const { tripId } = useParams();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [stars, setStars] = useState(5);
  const [comment, setComment] = useState("");
  const [tip, setTip] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const trip = useAppSelector((s) => s.trips.current);
  const tripLoading = useAppSelector((s) => s.trips.polling || s.trips.loading);
  const ratingLoading = useAppSelector((s) => s.ratings.loading);
  const ratingError = useAppSelector((s) => s.ratings.error);

  useEffect(() => {
    dispatch(fetchTripById(tripId));
  }, [dispatch, tripId]);

  const alreadyRated = !!trip?.rating;

  const handleSubmit = async () => {
    const result = await dispatch(submitRating({ tripId, stars, comment, tip_amount: tip }));
    if (!result.error) {
      dispatch(clearCurrentTrip());
      setSubmitted(true);
    }
  };

  // ── Loading ──
  if (tripLoading && !trip) {
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

  // ── Already rated ──
  if (alreadyRated) {
    return (
      <div style={pageStyle}>
        <PageHeader onBack={() => navigate(-1)} />
        <div style={{ maxWidth: 520, margin: "60px auto", padding: "0 32px" }}>
          <div style={{ ...card, textAlign: "center", padding: "56px 32px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>Already rated</h3>
            <p style={{ margin: "0 0 28px", color: colors.textMuted, fontSize: 14 }}>
              You've already submitted a rating for this trip.
            </p>
            <button style={btn.ghost} onClick={() => navigate("/rider/history")}>
              Back to Trip History
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Success ──
  if (submitted) {
    return (
      <div style={{ ...pageStyle, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: 480, padding: "0 32px" }}>
          <div style={{ ...card, textAlign: "center", padding: "64px 32px" }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🌟</div>
            <h2 style={{ margin: "0 0 8px", fontSize: 24, fontWeight: 700 }}>Thanks for rating!</h2>
            <p style={{ margin: "0 0 6px", fontSize: 15, color: colors.textMuted }}>
              Your feedback helps keep the service great.
            </p>
            {tip > 0 && (
              <p style={{ margin: "0 0 32px", fontSize: 14, color: colors.successLight }}>
                ${tip.toFixed(2)} tip sent to your driver.
              </p>
            )}
            {tip === 0 && <div style={{ marginBottom: 32 }} />}
            <button style={{ ...btn.primary, padding: "12px 40px", fontSize: 15 }} onClick={() => navigate("/rider/history")}>
              View Trip History
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ──
  return (
    <div style={pageStyle}>
      <PageHeader onBack={() => navigate(-1)} />

      {/* Two-column layout */}
      <div
        style={{
          maxWidth: 980,
          margin: "0 auto",
          padding: "0 32px 60px",
          display: "flex",
          gap: 24,
        }}
      >
        {/* ── Left column: context ── */}
        <div style={{ flex: "0 0 340px", minWidth: 280, display: "flex", flexDirection: "column" }}>
          <DriverInfoCard driverProfile={trip?.driverProfile} />
          <YourVehicleCard vehicle={trip?.vehicle} />
          {trip && <TripSummaryCard trip={trip} style={{ flex: 1, marginBottom: 0 }} />}
        </div>

        {/* ── Right column: form ── */}
        <div style={{ flex: 1, minWidth: 300, display: "flex", flexDirection: "column" }}>

          {/* Rating */}
          <div style={card}>
            <p style={{ ...sectionLabel, marginBottom: 16 }}>Your Rating</p>
            <StarPicker value={stars} onChange={setStars} />
          </div>

          {/* Tip */}
          <div style={card}>
            <p style={{ ...sectionLabel, marginBottom: 4 }}>Add a Tip</p>
            <p style={{ margin: "0 0 14px", fontSize: 13, color: colors.textMuted }}>
              Tips go directly to your driver and are optional.
            </p>
            <TipSelector value={tip} onChange={setTip} />
          </div>

          {/* Comment — grows to fill remaining height */}
          <div style={{ ...card, flex: 1, marginBottom: 16, display: "flex", flexDirection: "column" }}>
            <p style={{ ...sectionLabel, marginBottom: 4 }}>Feedback</p>
            <p style={{ margin: "0 0 12px", fontSize: 13, color: colors.textMuted }}>
              Optional — share anything about your experience.
            </p>
            <textarea
              placeholder="How was the ride? Any comments for your driver…"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={800}
              style={{
                flex: 1,
                width: "100%",
                padding: "12px 14px",
                background: colors.bgDeep,
                border: `1.5px solid ${colors.border}`,
                borderRadius: 8,
                color: colors.textPrimary,
                fontSize: 14,
                minHeight: 80,
                resize: "none",
                boxSizing: "border-box",
                outline: "none",
                fontFamily: "inherit",
                lineHeight: 1.5,
              }}
            />
            <p style={{ margin: "5px 0 0", fontSize: 11, color: colors.textMuted, textAlign: "right" }}>
              {comment.length} / 800
            </p>
          </div>

          {/* Error */}
          {ratingError && (
            <div style={{ ...errorBanner, marginBottom: 16 }}>{ratingError}</div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button
              onClick={handleSubmit}
              disabled={ratingLoading}
              style={{
                ...btn.primary,
                padding: "12px 32px",
                fontSize: 15,
                opacity: ratingLoading ? 0.6 : 1,
                minWidth: 180,
              }}
            >
              {ratingLoading ? "Submitting…" : tip > 0 ? `Submit & Tip $${tip.toFixed(2)}` : "Submit Rating"}
            </button>
            <button
              style={{ ...btn.ghost, padding: "12px 24px", fontSize: 14 }}
              onClick={() => navigate("/rider/history")}
            >
              Skip
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page header ──────────────────────────────────────────────────────────────

function PageHeader({ onBack }) {
  return (
    <div
      style={{
        borderBottom: `1px solid ${colors.borderSubtle}`,
        padding: "0 32px",
        marginBottom: 32,
      }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "20px 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={onBack}
          style={{
            background: "none",
            border: "none",
            color: colors.textMuted,
            cursor: "pointer",
            fontSize: 13,
            padding: 0,
            display: "flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          ← Trip History
        </button>
        <span style={{ color: colors.textFaint, fontSize: 13 }}>/</span>
        <span style={{ fontSize: 13, color: colors.textSecondary }}>Rate Your Trip</span>
      </div>
      <div style={{ maxWidth: 980, margin: "0 auto", paddingBottom: 20 }}>
        <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: colors.textPrimary }}>
          Rate Your Trip
        </h1>
        <p style={{ margin: "4px 0 0", fontSize: 14, color: colors.textMuted }}>
          Your feedback helps improve service quality for everyone.
        </p>
      </div>
    </div>
  );
}
