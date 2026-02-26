import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apiCreateTrip,
  apiDispatchTrip,
  apiGetMyTrips,
  apiGetTripById,
  apiArriveTrip,
  apiStartTrip,
  apiCompleteTrip,
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

// Phase 4 — driver lifecycle
export const arriveTrip = createAsyncThunk("trips/arrive", async (tripId, thunkAPI) => {
  try {
    const { data } = await apiArriveTrip(tripId);
    return data.trip;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const startTrip = createAsyncThunk("trips/start", async (tripId, thunkAPI) => {
  try {
    const { data } = await apiStartTrip(tripId);
    return data.trip;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const completeTrip = createAsyncThunk("trips/complete", async (tripId, thunkAPI) => {
  try {
    const { data } = await apiCompleteTrip(tripId);
    return data.trip;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

const tripsSlice = createSlice({
  name: "trips",
  initialState: {
    current: null,
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
      .addCase(fetchMyTrips.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to load trip history"; })

      // arrive
      .addCase(arriveTrip.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(arriveTrip.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(arriveTrip.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to arrive"; })

      // start
      .addCase(startTrip.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(startTrip.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(startTrip.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to start"; })

      // complete
      .addCase(completeTrip.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(completeTrip.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(completeTrip.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to complete"; });
  },
});

export const { clearTripsError, clearCurrentTrip } = tripsSlice.actions;
export default tripsSlice.reducer;