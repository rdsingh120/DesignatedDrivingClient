import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  apiGetMyNotifications,
  apiMarkAllNotificationsAsRead,
  apiMarkNotificationAsRead,
} from "../../api/client";
import { getErrorMessage } from "../../utils/errors";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchMine",
  async (_, thunkAPI) => {
    try {
      const { data } = await apiGetMyNotifications();
      return { notifications: data.notifications, unreadCount: data.unreadCount };
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

export const markNotificationAsRead = createAsyncThunk(
  "notifications/markAsRead",
  async (id, thunkAPI) => {
    try {
      await apiMarkNotificationAsRead(id);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

export const markAllNotificationsAsRead = createAsyncThunk(
  "notifications/markAllAsRead",
  async (_, thunkAPI) => {
    try {
      await apiMarkAllNotificationsAsRead();
    } catch (err) {
      return thunkAPI.rejectWithValue(getErrorMessage(err));
    }
  }
);

const notificationsSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (s) => { s.loading = true; s.error = null; })
      .addCase(fetchNotifications.fulfilled, (s, a) => {
        s.loading = false;
        s.notifications = a.payload.notifications;
        s.unreadCount = a.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload || "Failed to load notifications";
      })

      .addCase(markNotificationAsRead.fulfilled, (s, a) => {
        const n = s.notifications.find((n) => n._id === a.payload);
        if (n && !n.read) {
          n.read = true;
          s.unreadCount = Math.max(0, s.unreadCount - 1);
        }
      })

      .addCase(markAllNotificationsAsRead.fulfilled, (s) => {
        s.notifications.forEach((n) => { n.read = true; });
        s.unreadCount = 0;
      });
  },
});

export default notificationsSlice.reducer;
