import { colors, cardStyle, RIDER_TRIP_STATUS_INFO } from "../../../styles/theme";

const STEPS = ["REQUESTED", "ASSIGNED", "ENROUTE", "DRIVING", "COMPLETED"];

const STEP_LABELS = {
  REQUESTED: "Requested",
  ASSIGNED:  "Driver Assigned",
  ENROUTE:   "Driver En Route",
  DRIVING:   "In Progress",
  COMPLETED: "Completed",
};

export default function StatusTracker({ status }) {
  const info = RIDER_TRIP_STATUS_INFO[status] || RIDER_TRIP_STATUS_INFO["REQUESTED"];
  const currentIdx = STEPS.indexOf(status);

  return (
    <>
      {/* Status banner */}
      <div style={{ ...cardStyle, background: info.bg, border: `1px solid ${info.border}`, display: "flex", alignItems: "flex-start", gap: 16 }}>
        <div style={{ fontSize: 28, lineHeight: 1, marginTop: 2, flexShrink: 0 }}>{info.icon}</div>
        <div>
          <p style={{ margin: "0 0 4px", fontWeight: 700, fontSize: 16, color: info.color }}>{info.title}</p>
          <p style={{ margin: 0, fontSize: 14, color: colors.textSecondary, lineHeight: 1.5 }}>{info.subtitle}</p>
        </div>
      </div>

      {/* Step progress — only for non-cancelled trips */}
      {status !== "CANCELLED" && (
        <div style={{ ...cardStyle, padding: "20px 24px" }}>
          <p style={{ margin: "0 0 16px", fontWeight: 600, fontSize: 13, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>Trip Progress</p>
          <div style={{ display: "flex", alignItems: "center", gap: 0 }}>
            {STEPS.map((step, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              const isLast = i === STEPS.length - 1;
              const dotColor = done || active ? (active ? info.color : colors.successLight) : colors.border;
              const lineColor = done ? colors.successLight : colors.border;
              return (
                <div key={step} style={{ display: "flex", alignItems: "center", flex: isLast ? "none" : 1, minWidth: 0 }}>
                  {/* Dot + label */}
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, flexShrink: 0 }}>
                    <div style={{
                      width: active ? 14 : 10,
                      height: active ? 14 : 10,
                      borderRadius: "50%",
                      background: dotColor,
                      boxShadow: active ? `0 0 0 3px ${info.bg}, 0 0 0 5px ${info.border}` : "none",
                      transition: "all 0.3s",
                    }} />
                    <span style={{ fontSize: 10, color: active ? info.color : done ? colors.successLight : colors.textFaint, fontWeight: active ? 700 : 400, whiteSpace: "nowrap", maxWidth: 64, textAlign: "center", lineHeight: 1.2 }}>
                      {STEP_LABELS[step]}
                    </span>
                  </div>
                  {/* Connector line */}
                  {!isLast && (
                    <div style={{ flex: 1, height: 2, background: lineColor, marginBottom: 22, transition: "background 0.3s" }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
