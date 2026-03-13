import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiCreateRating, apiGetUserRatings, apiGetTripRatings } from "../../api/ratingsClient";

export const submitRating = createAsyncThunk(
  "ratings/submitRating",
  async ({ tripId, stars, comment }) => {
    const res = await apiCreateRating({ tripId, stars, comment });
    return res.data.rating;
  }
);

export const fetchUserRatings = createAsyncThunk(
  "ratings/fetchUserRatings",
  async (userId) => {
    const res = await apiGetUserRatings(userId);
    return res.data;
  }
);

export const fetchTripRatings = createAsyncThunk(
  "ratings/fetchTripRatings",
  async (tripId) => {
    const res = await apiGetTripRatings(tripId);
    return res.data.ratings;
  }
);

const ratingsSlice = createSlice({
  name: "ratings",
  initialState: {
    ratings: [],
    average: 0,
    count: 0,
    loading: false
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(submitRating.pending, (state) => {
        state.loading = true;
      })
      .addCase(submitRating.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserRatings.fulfilled, (state, action) => {
        state.average = action.payload.average_rating;
        state.count = action.payload.rating_count;
        state.ratings = action.payload.ratings;
      });
  }
});

export default ratingsSlice.reducer;