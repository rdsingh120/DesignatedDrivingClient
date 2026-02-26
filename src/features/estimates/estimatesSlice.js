import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { apiCreateEstimate } from "../../api/client";
import { getErrorMessage } from "../../utils/errors";

export const createEstimate = createAsyncThunk("estimates/create", async (payload, thunkAPI) => {
  try {
    const { data } = await apiCreateEstimate(payload);
    return data;
  } catch (err) {
    return thunkAPI.rejectWithValue(getErrorMessage(err));
  }
});

const estimatesSlice = createSlice({
  name: "estimates",
  initialState: {
    current: null, // holds latest estimate response
    loading: false,
    error: null,
  },
  reducers: {
    clearEstimate(state) {
      state.current = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createEstimate.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(createEstimate.fulfilled, (s, a) => { s.loading = false; s.current = a.payload; })
      .addCase(createEstimate.rejected, (s, a) => { s.loading = false; s.error = a.payload || "Failed to create estimate"; });
  },
});

export const { clearEstimate } = estimatesSlice.actions;
export default estimatesSlice.reducer;