import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";

import vehiclesReducer from "../features/vehicles/vehiclesSlice";
import estimatesReducer from "../features/estimates/estimatesSlice";
import tripsReducer from "../features/trips/tripsSlice";
import driverProfilesReducer from "../features/driver/driverProfilesSlice";

const placeholderReducer = (state = {}) => state;

export const store = configureStore({
  reducer: {
    auth: authReducer,

    vehicles: vehiclesReducer,
    estimates: estimatesReducer,
    trips: tripsReducer,
    driverProfiles: driverProfilesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});