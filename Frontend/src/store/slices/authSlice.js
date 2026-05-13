import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../services/api";

export const loginUser = createAsyncThunk("auth/login", async (credentials, { rejectWithValue }) => {
  try {
    const data = await authAPI.login(credentials);
    localStorage.setItem("token", data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const registerUser = createAsyncThunk("auth/register", async (payload, { rejectWithValue }) => {
  try {
    const data = await authAPI.register(payload);
    localStorage.setItem("token", data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const googleLogin = createAsyncThunk("auth/google", async (credential, { rejectWithValue }) => {
  try {
    const data = await authAPI.google({ credential });
    localStorage.setItem("token", data.token);
    return data;
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const forgotPassword = createAsyncThunk("auth/forgotPassword", async (email, { rejectWithValue }) => {
  try {
    return await authAPI.forgotPassword({ email });
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const resetPassword = createAsyncThunk("auth/resetPassword", async (payload, { rejectWithValue }) => {
  try {
    return await authAPI.resetPassword(payload);
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

export const fetchMe = createAsyncThunk("auth/me", async (_, { rejectWithValue }) => {
  try {
    return await authAPI.me();
  } catch (err) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: localStorage.getItem("token") || null,
    loading: false,
    error: null,
    resetMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
    },
    clearError: (state) => { state.error = null; },
    clearResetMessage: (state) => { state.resetMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
      })
      .addCase(loginUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
      })
      .addCase(registerUser.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(googleLogin.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(googleLogin.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        state.token = payload.token;
      })
      .addCase(googleLogin.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(forgotPassword.pending, (state) => { state.loading = true; state.error = null; state.resetMessage = null; })
      .addCase(forgotPassword.fulfilled, (state, { payload }) => { state.loading = false; state.resetMessage = payload.message; })
      .addCase(forgotPassword.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(resetPassword.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(resetPassword.fulfilled, (state, { payload }) => { state.loading = false; state.resetMessage = payload.message; })
      .addCase(resetPassword.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchMe.fulfilled, (state, { payload }) => { state.user = payload; })
      .addCase(fetchMe.rejected, (state) => { state.user = null; state.token = null; localStorage.removeItem("token"); });
  },
});

export const { logout, clearError, clearResetMessage } = authSlice.actions;
export default authSlice.reducer;
