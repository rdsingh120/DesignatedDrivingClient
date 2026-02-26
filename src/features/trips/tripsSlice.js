import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apiCreateTrip,
  apiDispatchTrip,
  apiGetMyTrips,
  apiGetTripById,
} from "../../api/client";
import { getErrorMessage } from "../../utils/errors";

export const createTrip = createAsyncThunk("trips/create", async (payload, thunkAPI) => {
  try {
    const { data } = await apiCreateTrip(payload);
    return data.trip;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const dispatchTrip = createAsyncThunk("trips/dispatch", async (tripId, thunkAPI) => {
  try {
    const { data } = await apiDispatchTrip(tripId);
    return data.trip;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const fetchTripById = createAsyncThunk("trips/fetchById", async (tripId, thunkAPI) => {
  try {
    const { data } = await apiGetTripById(tripId);
    return data.trip;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const fetchMyTrips = createAsyncThunk("trips/fetchMine", async (_, thunkAPI) => {
  try {
    const { data } = await apiGetMyTrips();
    return data.trips ?? [];
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

const tripsSlice = createSlice({
  name: "trips",
  initialState: {
    current: null,   // active trip being viewed
    mine: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearTripsError(state) {
      state.error = null;
    },
    clearCurrentTrip(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // create trip
      .addCase(createTrip.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createTrip.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(createTrip.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to create trip"; })

      // dispatch
      .addCase(dispatchTrip.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(dispatchTrip.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(dispatchTrip.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to dispatch trip"; })

      // fetch by id
      .addCase(fetchTripById.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchTripById.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(fetchTripById.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to fetch trip"; })

      // history
      .addCase(fetchMyTrips.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMyTrips.fulfilled, (s, a) => { s.loading = false; s.mine = a.payload; })
      .addCase(fetchMyTrips.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to load trip history"; });
  },
});

export const { clearTripsError, clearCurrentTrip } = tripsSlice.actions;
export default tripsSlice.reducer;