export const API = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
  },

  VEHICLES: {
    CREATE: "/api/vehicles",
    MINE: "/api/vehicles/mine",
    DELETE: (id) => `/api/vehicles/${id}`,
  },

  ESTIMATES: {
    CREATE: "/api/estimates",
  },

  TRIPS: {
    CREATE_FROM_ESTIMATE: "/api/trips", // body: { estimateId, vehicleId }
    MINE: "/api/trips/mine",
    BY_ID: (id) => `/api/trips/${id}`,
    DISPATCH: (id) => `/api/trips/${id}/dispatch`,
    ARRIVE: (id) => `/api/trips/${id}/arrive`,
    START: (id) => `/api/trips/${id}/start`,
    COMPLETE: (id) => `/api/trips/${id}/complete`,
  },

  DRIVER_PROFILES: {
    ME: "/api/driver-profiles/me",
    UPDATE_STATUS: "/api/driver-profiles/me/status",
  },
};