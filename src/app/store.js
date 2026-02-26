import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

import vehiclesReducer from "../features/vehicles/vehiclesSlice";
import estimatesReducer from "../features/estimates/estimatesSlice";
import tripsReducer from "../features/trips/tripsSlice";

const placeholderReducer = (state = {}) => state;

export const store = configureStore({
  reducer: {
    auth: authReducer,

    vehicles: vehiclesReducer,
    estimates: estimatesReducer,
    trips: tripsReducer,

    // Phase 4+
    driverProfiles: placeholderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});