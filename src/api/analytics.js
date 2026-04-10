import { http } from "./http";


export const fetchAdminAnalytics = () =>
  http.get("/api/analytics/admin").then((res) => res.data);
