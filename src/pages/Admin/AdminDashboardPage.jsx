import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { logout, selectUser } from "../../features/auth/authSlice";
import { fetchMyTrips } from "../../features/trips/tripsSlice";
import { http } from "../../api/http";
import {
  colors, alpha, gradients, cardStyle, tripStatusColors,
} from "../../styles/theme";
import { LogOut, Users, Car, CheckCircle, XCircle, Clock, Trash2 } from "lucide-react";


function StatCard({ icon, label, value, accent }) {
  return (
    <div style={{ background: colors.bgBase, border: `1px solid ${colors.border}`, borderRadius: 16, padding: 24 }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: accent, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        {icon}
      </div>
      <p style={{ margin: "0 0 4px", fontSize: 28, fontWeight: 800, color: colors.textPrimary }}>{value ?? "—"}</p>
      <p style={{ margin: 0, fontSize: 13, color: colors.textMuted }}>{label}</p>
    </div>
  );
}


function Badge({ status, text }) {
  const s = tripStatusColors[status] || { bg: alpha.neutral15, color: colors.textMuted };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
      {text || s.label || status}
    </span>
  );
}


function VerifBadge({ status }) {
  const map = {
    VERIFIED: { bg: alpha.success15, color: colors.successLight },
    PENDING:  { bg: alpha.warning15, color: colors.warningLight },
    REJECTED: { bg: alpha.danger15,  color: colors.dangerLight  },
  };
  const s = map[status] || map.PENDING;
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {status}
    </span>
  );
}


function RoleBadge({ role }) {
  const map = {
    RIDER:  { bg: alpha.info15,    color: colors.infoLight    },
    DRIVER: { bg: alpha.primary15, color: colors.primaryLight },
    ADMIN:  { bg: alpha.success15, color: colors.successLight },
  };
  const s = map[role] || { bg: alpha.neutral15, color: colors.textMuted };
  return (
    <span style={{ background: s.bg, color: s.color, fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20, textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {role}
    </span>
  );
}


function SectionHeader({ children }) {
  return (
    <p style={{ margin: "0 0 16px", fontWeight: 600, fontSize: 13, color: colors.textSecondary, textTransform: "uppercase", letterSpacing: "0.06em" }}>
      {children}
    </p>
  );
}


export default function AdminDashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);
  const trips = useAppSelector((s) => s.trips.mine || []);
  const tripsLoading = useAppSelector((s) => s.trips.loading);

  const [drivers, setDrivers] = useState([]);
  const [driversLoading, setDriversLoading] = useState(true);

  const [riders, setRiders] = useState([]);
  const [ridersLoading, setRidersLoading] = useState(true);

  const [verifyingId, setVerifyingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch all trips
  useEffect(() => { dispatch(fetchMyTrips()); }, [dispatch]);

  // Fetch all driver profiles
  useEffect(() => {
    setDriversLoading(true);
    http.get("/api/driver-profiles/all")
      .then((res) => setDrivers(res.data.driverProfiles || []))
      .catch(() => setDrivers([]))
      .finally(() => setDriversLoading(false));
  }, []);

  // Fetch all users, filter to riders
  useEffect(() => {
    setRidersLoading(true);
    http.get("/api/users/all")
      .then((res) => setRiders((res.data.users || []).filter((u) => u.role === "RIDER")))
      .catch(() => setRiders([]))
      .finally(() => setRidersLoading(false));
  }, []);

  async function handleVerify(profileId, status) {
    setVerifyingId(profileId);
    try {
      await http.patch(`/api/driver-profiles/${profileId}/verify`, { verificationStatus: status });
      setDrivers((prev) =>
        prev.map((d) => d._id === profileId ? { ...d, verificationStatus: status } : d)
      );
    } finally {
      setVerifyingId(null);
    }
  }

  async function handleDeleteRider(userId) {
    if (!window.confirm("Are you sure you want to delete this rider account? This cannot be undone.")) return;
    setDeletingId(userId);
    try {
      await http.delete(`/api/users/${userId}`);
      setRiders((prev) => prev.filter((r) => r._id !== userId));
    } finally {
      setDeletingId(null);
    }
  }

  // Stats
  const totalTrips     = trips.length;
  const activeTrips    = trips.filter((t) => ["ASSIGNED", "ENROUTE", "DRIVING"].includes(t.status)).length;
  const completedTrips = trips.filter((t) => t.status === "COMPLETED").length;
  const pendingDrivers = drivers.filter((d) => d.verificationStatus === "PENDING").length;

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "drivers",  label: `Drivers${pendingDrivers ? ` (${pendingDrivers} pending)` : ""}` },
    { key: "riders",   label: `Riders` },
    { key: "trips",    label: "All Trips" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: gradients.page, color: colors.textPrimary, fontFamily: "system-ui, sans-serif", padding: "0 0 60px" }}>


      <header style={{
        background: "rgba(15,23,42,0.8)",
        borderBottom: `1px solid ${colors.borderSubtle}`,
        padding: "16px 28px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        backdropFilter: "blur(8px)",
        position: "sticky", top: 0, zIndex: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: gradients.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>
            🛡️
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>Admin Dashboard</div>
            <div style={{ fontSize: 12, color: colors.textMuted }}>{user?.name || user?.email}</div>
          </div>
        </div>
        <button
          onClick={() => dispatch(logout())}
          style={{ display: "flex", alignItems: "center", gap: 6, background: alpha.dangerBtn, border: `1px solid ${alpha.dangerBtnBorder}`, color: colors.dangerLight, padding: "7px 14px", borderRadius: 8, cursor: "pointer", fontSize: 13, fontWeight: 600 }}
        >
          <LogOut size={14} /> Sign out
        </button>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 0" }}>


        <div style={{ display: "flex", gap: 4, marginBottom: 28, background: colors.bgBase, border: `1px solid ${colors.border}`, borderRadius: 12, padding: 4, width: "fit-content", flexWrap: "wrap" }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: "8px 18px", borderRadius: 9, border: "none", cursor: "pointer",
                fontWeight: 600, fontSize: 13, transition: "all 0.15s",
                background: activeTab === t.key ? gradients.primary : "transparent",
                color: activeTab === t.key ? "#fff" : colors.textSecondary,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>


        {activeTab === "overview" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
              <StatCard icon={<Car size={22} color={colors.primary} />}        label="Total Trips"       value={totalTrips}     accent={alpha.primary15} />
              <StatCard icon={<Clock size={22} color={colors.warning} />}      label="Active Trips"      value={activeTrips}    accent={alpha.warning15} />
              <StatCard icon={<CheckCircle size={22} color={colors.success} />} label="Completed Trips"  value={completedTrips} accent={alpha.success15} />
              <StatCard icon={<Users size={22} color={colors.primaryLight} />} label="Pending Drivers"   value={pendingDrivers} accent={alpha.primary15} />
              <StatCard icon={<Users size={22} color={colors.infoLight} />}    label="Total Riders"      value={riders.length}  accent={alpha.info15} />
            </div>

            <div style={cardStyle}>
              <SectionHeader> Pending Driver Approvals</SectionHeader>
              {driversLoading ? (
                <p style={{ color: colors.textMuted, fontSize: 14 }}>Loading…</p>
              ) : drivers.filter((d) => d.verificationStatus === "PENDING").length === 0 ? (
                <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>No pending approvals </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {drivers.filter((d) => d.verificationStatus === "PENDING").map((d) => (
                    <DriverRow key={d._id} driver={d} verifyingId={verifyingId} onVerify={handleVerify} />
                  ))}
                </div>
              )}
            </div>

            <div style={cardStyle}>
              <SectionHeader>Recent Trips</SectionHeader>
              {tripsLoading ? (
                <p style={{ color: colors.textMuted, fontSize: 14 }}>Loading…</p>
              ) : trips.length === 0 ? (
                <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>No trips yet.</p>
              ) : (
                <TripTable trips={trips.slice(0, 8)} />
              )}
            </div>
          </>
        )}

        {activeTab === "drivers" && (
          <div style={cardStyle}>
            <SectionHeader>All Drivers ({drivers.length})</SectionHeader>
            {driversLoading ? (
              <p style={{ color: colors.textMuted, fontSize: 14 }}>Loading…</p>
            ) : drivers.length === 0 ? (
              <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>No driver profiles found.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {drivers.map((d) => (
                  <DriverRow key={d._id} driver={d} verifyingId={verifyingId} onVerify={handleVerify} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "riders" && (
          <div style={cardStyle}>
            <SectionHeader>All Riders ({riders.length})</SectionHeader>
            {ridersLoading ? (
              <p style={{ color: colors.textMuted, fontSize: 14 }}>Loading…</p>
            ) : riders.length === 0 ? (
              <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>No riders found.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {riders.map((r) => (
                  <RiderRow key={r._id} rider={r} deletingId={deletingId} onDelete={handleDeleteRider} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "trips" && (
          <div style={cardStyle}>
            <SectionHeader>All Trips ({trips.length})</SectionHeader>
            {tripsLoading ? (
              <p style={{ color: colors.textMuted, fontSize: 14 }}>Loading…</p>
            ) : trips.length === 0 ? (
              <p style={{ color: colors.textMuted, fontSize: 14, margin: 0 }}>No trips yet.</p>
            ) : (
              <TripTable trips={trips} />
            )}
          </div>
        )}

      </div>
    </div>
  );
}

function DriverRow({ driver, verifyingId, onVerify }) {
  const name  = driver.user?.name  || "Unknown";
  const email = driver.user?.email || "";
  const isBusy = verifyingId === driver._id;

  return (
    <div style={{ background: colors.bgDeep, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: colors.textPrimary }}>{name}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <VerifBadge status={driver.verificationStatus} />
          {email && <span style={{ fontSize: 12, color: colors.textMuted }}>{email}</span>}
          {driver.licenseNumber && <span style={{ fontSize: 12, color: colors.textMuted }}>Lic: {driver.licenseNumber}</span>}
          {driver.phoneNumber   && <span style={{ fontSize: 12, color: colors.textMuted }}>{driver.phoneNumber}</span>}
        </div>
      </div>

      <div style={{ display: "flex", gap: 8 }}>
        {driver.verificationStatus !== "VERIFIED" && (
          <button
            disabled={isBusy}
            onClick={() => onVerify(driver._id, "VERIFIED")}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: alpha.success15, border: `1px solid ${alpha.success25}`, color: colors.successLight, borderRadius: 8, cursor: isBusy ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13, opacity: isBusy ? 0.5 : 1 }}
          >
            <CheckCircle size={14} /> Approve
          </button>
        )}
        {driver.verificationStatus !== "REJECTED" && (
          <button
            disabled={isBusy}
            onClick={() => onVerify(driver._id, driver.verificationStatus === "VERIFIED" ? "REJECTED" : "REJECTED")}
            style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: alpha.danger10, border: `1px solid ${alpha.dangerBtnBorder}`, color: colors.dangerLight, borderRadius: 8, cursor: isBusy ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13, opacity: isBusy ? 0.5 : 1 }}
          >
            <XCircle size={14} /> {driver.verificationStatus === "VERIFIED" ? "Revoke" : "Reject"}
          </button>
        )}
      </div>
    </div>
  );
}

function RiderRow({ rider, deletingId, onDelete }) {
  const isBusy = deletingId === rider._id;
  const joined = rider.createdAt ? new Date(rider.createdAt).toLocaleDateString() : "—";

  return (
    <div style={{ background: colors.bgDeep, borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <span style={{ fontWeight: 600, fontSize: 14, color: colors.textPrimary }}>{rider.name || "—"}</span>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <RoleBadge role={rider.role} />
          <span style={{ fontSize: 12, color: colors.textMuted }}>{rider.email}</span>
          <span style={{ fontSize: 12, color: colors.textMuted }}>Joined {joined}</span>
        </div>
      </div>

      <button
        disabled={isBusy}
        onClick={() => onDelete(rider._id)}
        style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", background: alpha.danger10, border: `1px solid ${alpha.dangerBtnBorder}`, color: colors.dangerLight, borderRadius: 8, cursor: isBusy ? "not-allowed" : "pointer", fontWeight: 600, fontSize: 13, opacity: isBusy ? 0.5 : 1 }}
      >
        <Trash2 size={14} /> {isBusy ? "Deleting…" : "Delete"}
      </button>
    </div>
  );
}

function TripTable({ trips }) {
  return (
    <div style={{ overflowX: "auto" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: `1px solid ${colors.border}` }}>
            {["Status", "Pickup", "Dropoff", "Fare", "Driver", "Rider"].map((h) => (
              <th key={h} style={{ padding: "8px 12px", textAlign: "left", color: colors.textMuted, fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {trips.map((t) => (
            <tr key={t._id} style={{ borderBottom: `1px solid ${colors.borderSubtle}` }}>
              <td style={{ padding: "10px 12px" }}><Badge status={t.status} /></td>
              <td style={{ padding: "10px 12px", color: colors.textSecondary, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.pickup_display_address || t.pickup_address || "—"}
              </td>
              <td style={{ padding: "10px 12px", color: colors.textSecondary, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {t.dropoff_display_address || t.dropoff_address || "—"}
              </td>
              <td style={{ padding: "10px 12px", color: colors.primary, fontWeight: 700, whiteSpace: "nowrap" }}>
                {t.fare_amount ? `${t.fare_amount} ${t.currency}` : "—"}
              </td>
              <td style={{ padding: "10px 12px", color: colors.textSecondary }}>{t.driverProfile?.user?.name || "Unassigned"}</td>
              <td style={{ padding: "10px 12px", color: colors.textSecondary }}>{t.rider?.name || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
