import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getErrorMessage } from "../../utils/errors";
import {
  apiGetMyDriverProfile as getMe,
  apiUpdateMyDriverStatus as updateStatus,
  apiCreateMyDriverProfile as createMe,
} from "../../api/driverClient";
import { acceptTrip, cancelTrip, completeTrip } from "../trips/tripsSlice";
import { logout } from "../auth/authSlice";

export const getMyDriverProfile = createAsyncThunk(
  "driverProfiles/getMe",
  async (_, thunkAPI) => {
    try {
      const { data } = await getMe();
      return data.driverProfile;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

export const updateMyDriverStatus = createAsyncThunk(
  "driverProfiles/updateStatus",
  async (payload, thunkAPI) => {
    try {
      const { data } = await updateStatus(payload);
      return data.driverProfile;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

export const createMyDriverProfile = createAsyncThunk(
  "driverProfiles/createMe",
  async (_, thunkAPI) => {
    try {
      const { data } = await createMe();
      return data.driverProfile;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

const driverProfilesSlice = createSlice({
  name: "driverProfiles",
  initialState: {
    me: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearDriverProfilesError(state) {
      state.error = null;
    },
  },
  extraReducers: (b) => {
    b.addCase(getMyDriverProfile.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(getMyDriverProfile.fulfilled, (s, a) => {
      s.loading = false;
      s.me = a.payload;
    });
    b.addCase(getMyDriverProfile.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || "Failed to load driver profile";
    });

    b.addCase(updateMyDriverStatus.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(updateMyDriverStatus.fulfilled, (s, a) => {
      s.loading = false;
      s.me = a.payload;
    });
    b.addCase(updateMyDriverStatus.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || "Failed to update driver status";
    })

    // create driver profile
    b.addCase(createMyDriverProfile.pending, (s) => {
      s.loading = true;
      s.error = null;
    });
    b.addCase(createMyDriverProfile.fulfilled, (s, a) => {
      s.loading = false;
      s.me = a.payload;
    });
    b.addCase(createMyDriverProfile.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload || "Failed to create driver profile";
    });

    // sync profile after trip lifecycle actions
    b.addCase(acceptTrip.fulfilled, (s, a) => {
      if (s.me && a.payload.driverProfile) {
        s.me = a.payload.driverProfile;
      }
    });
    b.addCase(cancelTrip.fulfilled, (s) => {
      if (s.me) {
        s.me.activeTrip = null;
        s.me.availability = "AVAILABLE";
      }
    });
    b.addCase(completeTrip.fulfilled, (s) => {
      if (s.me) {
        s.me.activeTrip = null;
        s.me.availability = "AVAILABLE";
      }
    });

    b.addCase(logout, (s) => {
      s.me = null;
      s.loading = false;
      s.error = null;
    });
  },
});

export const { clearDriverProfilesError } = driverProfilesSlice.actions;
export default driverProfilesSlice.reducer;