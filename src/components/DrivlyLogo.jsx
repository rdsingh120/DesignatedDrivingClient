export default function DrivlyLogo({ onClick }) {
  return (
    <button
      onClick={onClick}
      style={{ background: "none", border: "none", cursor: "pointer", padding: 0, marginLeft: -6, display: "flex", alignItems: "center" }}
    >
      <svg width="85" height="34" viewBox="0 0 85 34" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="drivlyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>
        </defs>
        {/* Speed accent lines */}
        <line x1="2" y1="10" x2="11" y2="10" stroke="url(#drivlyGrad)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.4" />
        <line x1="0" y1="17" x2="11" y2="17" stroke="url(#drivlyGrad)" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.7" />
        <line x1="3" y1="24" x2="11" y2="24" stroke="url(#drivlyGrad)" strokeWidth="2" strokeLinecap="round" strokeOpacity="1" />
        {/* Wordmark */}
        <text
          x="17" y="26"
          fontFamily="system-ui, -apple-system, sans-serif"
          fontWeight="800"
          fontSize="22"
          fill="url(#drivlyGrad)"
          letterSpacing="-0.8"
        >
          Drivly
        </text>
      </svg>
    </button>
  );
}
