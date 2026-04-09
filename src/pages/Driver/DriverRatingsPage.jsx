// src/pages/Driver/DriverRatingsPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../../app/hooks";
import { selectUser } from "../../features/auth/authSlice";
import { apiGetUserRatings } from "../../api/ratingsClient";
import { colors, pageStyle, cardStyle } from "../../styles/theme";
import DriverNavBar from "../../components/DriverNavBar";

const STAR_COLOR = "#f5b50a";

function Stars({ value, size = 18 }) {
  const starSpacing = Math.round(size * 0.15);
  return (
    <span style={{ display: "inline-flex", position: "relative", gap: starSpacing }}>
      {/* Empty layer */}
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ fontSize: size, color: colors.border, lineHeight: 1 }}>★</span>
      ))}
      {/* Filled layer clipped to fractional width */}
      <span style={{
        position: "absolute", top: 0, left: 0,
        overflow: "hidden",
        width: `${(value / 5) * 100}%`,
        display: "flex", gap: starSpacing, whiteSpace: "nowrap",
      }}>
        {[1, 2, 3, 4, 5].map((s) => (
          <span key={s} style={{ fontSize: size, color: STAR_COLOR, lineHeight: 1, flexShrink: 0 }}>★</span>
        ))}
      </span>
    </span>
  );
}

function ScoreBar({ label, count, total }) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
      <span style={{ fontSize: 12, color: colors.textMuted, width: 16, textAlign: "right", flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: 12, color: STAR_COLOR, flexShrink: 0 }}>★</span>
      <div style={{ flex: 1, height: 6, background: colors.border, borderRadius: 3, overflow: "hidden" }}>
        <div style={{ height: "100%", width: `${pct}%`, background: STAR_COLOR, borderRadius: 3, transition: "width 0.4s ease" }} />
      </div>
      <span style={{ fontSize: 12, color: colors.textFaint, width: 28, textAlign: "right", flexShrink: 0 }}>{count}</span>
    </div>
  );
}

export default function DriverRatingsPage() {
  const navigate = useNavigate();
  const user = useAppSelector(selectUser);

  const [data, setData] = useState({ average: 0, count: 0, ratings: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?._id) return;
    setLoading(true);
    apiGetUserRatings(user._id)
      .then((res) => {
        const d = res.data;
        setData({
          average: d.average_rating ?? 0,
          count: d.rating_count ?? 0,
          ratings: d.ratings ?? [],
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user?._id]);

  // Distribution: count per star level
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: data.ratings.filter((r) => r.stars === star).length,
  }));

  const withComments = data.ratings.filter((r) => r.comment);

  return (
    <div style={pageStyle}>
      <DriverNavBar />
      {/* Header */}
      <div style={{ borderBottom: `1px solid ${colors.border}`, padding: "0 24px" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 0 16px", display: "flex", alignItems: "center", gap: 10 }}>
          <button
            onClick={() => navigate("/driver")}
            style={{ background: "none", border: "none", color: colors.textMuted, cursor: "pointer", fontSize: 13, padding: 0, display: "flex", alignItems: "center", gap: 4 }}
          >
            ← Dashboard
          </button>
          <span style={{ color: colors.textFaint, fontSize: 13 }}>/</span>
          <span style={{ fontSize: 13, color: colors.textSecondary }}>My Ratings</span>
        </div>
        <div style={{ maxWidth: 720, margin: "0 auto", paddingBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 700, color: colors.textPrimary }}>My Ratings</h1>
          <p style={{ margin: "4px 0 0", fontSize: 14, color: colors.textMuted }}>
            See how riders rate your designated driving service.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 720, margin: "0 auto", padding: "28px 24px 60px" }}>
        {loading ? (
          <div style={{ ...cardStyle, textAlign: "center", padding: "60px 24px" }}>
            <p style={{ margin: 0, color: colors.textMuted, fontSize: 15 }}>Loading ratings…</p>
          </div>
        ) : data.count === 0 ? (
          <div style={{ ...cardStyle, textAlign: "center", padding: "60px 24px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
            <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>No ratings yet</h3>
            <p style={{ margin: 0, color: colors.textMuted, fontSize: 14 }}>
              Complete trips to start receiving feedback from riders.
            </p>
          </div>
        ) : (
          <>
            {/* ── Score Overview ── */}
            <div style={{ ...cardStyle, display: "flex", gap: 24, alignItems: "flex-start", flexWrap: "wrap" }}>
              {/* Big score */}
              <div style={{ textAlign: "center", minWidth: 100 }}>
                <p style={{ margin: 0, fontSize: 52, fontWeight: 800, color: STAR_COLOR, lineHeight: 1 }}>
                  {data.average.toFixed(1)}
                </p>
                <Stars value={data.average} size={18} />
                <p style={{ margin: "8px 0 0", fontSize: 13, color: colors.textMuted }}>
                  {data.count} rating{data.count === 1 ? "" : "s"}
                </p>
              </div>

              {/* Distribution bars */}
              <div style={{ flex: 1, minWidth: 180 }}>
                {dist.map(({ star, count }) => (
                  <ScoreBar key={star} label={star} count={count} total={data.count} />
                ))}
              </div>
            </div>

            {/* ── All Feedback ── */}
            {withComments.length > 0 && (
              <div>
                <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Rider Feedback
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {withComments.map((r) => (
                    <div key={r._id} style={{ ...cardStyle, marginBottom: 0, padding: "16px 18px" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                        <Stars value={r.stars} size={15} />
                        <span style={{ fontSize: 12, color: colors.textFaint }}>
                          {r.rater?.name || "Rider"} · {new Date(r.createdAt).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" })}
                        </span>
                      </div>
                      <p style={{ margin: 0, fontSize: 14, color: colors.textSecondary, lineHeight: 1.6 }}>
                        "{r.comment}"
                      </p>
                      {r.tip_amount > 0 && (
                        <p style={{ margin: "8px 0 0", fontSize: 12, color: colors.successLight }}>
                          + ${r.tip_amount.toFixed(2)} tip
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ratings without comments */}
            {data.ratings.filter((r) => !r.comment).length > 0 && (
              <div style={{ marginTop: 20 }}>
                <p style={{ margin: "0 0 12px", fontSize: 13, fontWeight: 600, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  Star Ratings (no comment)
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
                  {data.ratings.filter((r) => !r.comment).map((r) => (
                    <div key={r._id} style={{ padding: "10px 14px", background: colors.bgBase, border: `1px solid ${colors.border}`, borderRadius: 10, display: "flex", alignItems: "center", gap: 10 }}>
                      <Stars value={r.stars} size={13} />
                      <span style={{ fontSize: 12, color: colors.textFaint }}>
                        {r.rater?.name || "Rider"} · {new Date(r.createdAt).toLocaleDateString([], { month: "short", day: "numeric" })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
