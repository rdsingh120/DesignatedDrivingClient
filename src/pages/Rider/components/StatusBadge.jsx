import { colors, alpha, tripStatusColors } from "../../../styles/theme";

export default function StatusBadge({ status }) {
  const s = tripStatusColors[status] || { bg: alpha.neutral15, color: colors.textSecondary, label: status };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 13, fontWeight: 600, padding: "4px 12px", borderRadius: 20 }}>
      {s.label}
    </span>
  );
}
