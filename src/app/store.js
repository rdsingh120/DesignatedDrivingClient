import { configureStore } from "@reduxjs/toolkit";

const placeholderReducer = (state = {}) => state;

export const store = configureStore({
  reducer: {
    auth: placeholderReducer,
    vehicles: placeholderReducer,
    estimates: placeholderReducer,
    trips: placeholderReducer,
    driverProfiles: placeholderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});