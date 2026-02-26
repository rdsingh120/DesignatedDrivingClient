import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiCreateVehicle, apiDeleteVehicle, apiGetMyVehicles } from "../../api/client";
import { getErrorMessage } from "../../utils/errors";

export const fetchMyVehicles = createAsyncThunk("vehicles/fetchMine", async (_, thunkAPI) => {
  try {
    const { data } = await apiGetMyVehicles();
    return data.vehicles ?? [];
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const createVehicle = createAsyncThunk("vehicles/create", async (payload, thunkAPI) => {
  try {
    const { data } = await apiCreateVehicle(payload);
    return data.vehicle;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

export const deleteVehicle = createAsyncThunk("vehicles/delete", async (id, thunkAPI) => {
  try {
    await apiDeleteVehicle(id);
    return id;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

const vehiclesSlice = createSlice({
  name: "vehicles",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearVehiclesError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchMyVehicles.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchMyVehicles.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
      .addCase(fetchMyVehicles.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to load vehicles"; })

      // create
      .addCase(createVehicle.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createVehicle.fulfilled, (s, a) => { s.loading = false; s.items.unshift(a.payload); })
      .addCase(createVehicle.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to create vehicle"; })

      // delete
      .addCase(deleteVehicle.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(deleteVehicle.fulfilled, (s, a) => { s.loading = false; s.items = s.items.filter(v => v._id !== a.payload); })
      .addCase(deleteVehicle.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to delete vehicle"; });
  },
});

export const { clearVehiclesError } = vehiclesSlice.actions;
export default vehiclesSlice.reducer;