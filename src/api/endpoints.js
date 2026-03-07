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
    CREATE_FROM_ESTIMATE: "/api/trips",
    MINE: "/api/trips/mine",
    OPEN: "/api/trips/open",          
    BY_ID: (id) => `/api/trips/${id}`,
    ACCEPT: (id) => `/api/trips/${id}/accept`, 
    ARRIVE: (id) => `/api/trips/${id}/arrive`,
    START: (id) => `/api/trips/${id}/start`,
    COMPLETE: (id) => `/api/trips/${id}/complete`,
    CANCEL: (id) => `/api/trips/${id}/cancel`,
  },

  DRIVER_PROFILES: {
    ME: "/api/driver-profiles/me",
    UPDATE_STATUS: "/api/driver-profiles/me/status",
  },
};