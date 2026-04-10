// src/api/incidentReports.js
import { http } from "./http";

/** Fetch all incident reports (admin only). */
export const fetchIncidentReports = () =>
  http.get("/api/incident-reports").then((res) => res.data);

export const resolveIncidentReport = (id, resolutionNotes = "") =>
  http.patch(`/api/incident-reports/${id}/resolve`, { resolutionNotes }).then((res) => res.data);
