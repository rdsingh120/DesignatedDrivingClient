import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { http } from "../../api/http";
import { API } from "../../api/endpoints";

const LS_TOKEN = "token";
const LS_USER = "user";

function loadFromStorage() {
  try {
    const token = localStorage.getItem(LS_TOKEN) || null;
    const userRaw = localStorage.getItem(LS_USER);
    const user = userRaw ? JSON.parse(userRaw) : null;
    return { token, user };
  } catch {
    return { token: null, user: null };
  }
}

function saveToStorage(token, user) {
  localStorage.setItem(LS_TOKEN, token);
  localStorage.setItem(LS_USER, JSON.stringify(user));
}

function clearStorage() {
  localStorage.removeItem(LS_TOKEN);
  localStorage.removeItem(LS_USER);
}

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(API.AUTH.LOGIN, { email, password });

      // backend returns: { _id, name, email, role, token }
      const token = data?.token;
      if (!token) return rejectWithValue({ message: "Missing token from server" });

      const user = { _id: data._id, name: data.name, email: data.email, role: data.role };

      saveToStorage(token, user);
      return { token, user };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const register = createAsyncThunk(
  "auth/register",
  async ({ name, email, password, role }, { rejectWithValue }) => {
    try {
      const { data } = await http.post(API.AUTH.REGISTER, { name, email, password, role });

      const token = data?.token;
      if (!token) return rejectWithValue({ message: "Missing token from server" });

      const user = { _id: data._id, name: data.name, email: data.email, role: data.role };

      saveToStorage(token, user);
      return { token, user };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const initial = loadFromStorage();

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: initial.token,
    user: initial.user,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
  },
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
      clearStorage();
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // login
      .addCase(login.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error;
      })

      // register
      .addCase(register.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(register.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || action.error;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;

export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthed = (state) => Boolean(state.auth.token && state.auth.user);
export const selectRole = (state) => (state.auth.user?.role || "").toUpperCase();

export default authSlice.reducer;