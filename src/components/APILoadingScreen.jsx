import { gradients, colors } from "../styles/theme";

export default function APILoadingScreen() {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: gradients.page,
        color: colors.textPrimary,
        fontFamily: "system-ui, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div style={{ fontSize: 40 }}>🚘</div>

      <h2 style={{ margin: 0 }}>Starting server...</h2>

      <p style={{ color: colors.textMuted }}>The API is waking up. This can take ~30 seconds.</p>

      <div
        style={{
          width: 40,
          height: 40,
          border: "4px solid rgba(255,255,255,0.2)",
          borderTop: "4px solid white",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }}
      />

      <style>
        {`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        `}
      </style>
    </div>
  );
}
