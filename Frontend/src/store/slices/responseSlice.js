import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { responseAPI } from "../../services/api";

export const submitResponse = createAsyncThunk("responses/submit", async (body, { rejectWithValue }) => {
  try { return await responseAPI.submit(body); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchAnalytics = createAsyncThunk("responses/analytics", async (pollId, { rejectWithValue }) => {
  try { return await responseAPI.analytics(pollId); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchPublicResults = createAsyncThunk("responses/publicResults", async (link, { rejectWithValue }) => {
  try { return await responseAPI.publicResults(link); } catch (err) { return rejectWithValue(err.message); }
});

const responseSlice = createSlice({
  name: "responses",
  initialState: {
    analytics: null,
    publicResults: null,
    loading: false,
    submitted: false,
    error: null,
  },
  reducers: {
    resetSubmission: (state) => { state.submitted = false; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitResponse.pending, (state) => { state.loading = true; })
      .addCase(submitResponse.fulfilled, (state) => { state.loading = false; state.submitted = true; })
      .addCase(submitResponse.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchAnalytics.pending, (state) => { state.loading = true; })
      .addCase(fetchAnalytics.fulfilled, (state, { payload }) => { state.loading = false; state.analytics = payload; })
      .addCase(fetchAnalytics.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(fetchPublicResults.pending, (state) => { state.loading = true; })
      .addCase(fetchPublicResults.fulfilled, (state, { payload }) => { state.loading = false; state.publicResults = payload; })
      .addCase(fetchPublicResults.rejected, (state, { payload }) => { state.loading = false; state.error = payload; });
  },
});

export const { resetSubmission } = responseSlice.actions;
export default responseSlice.reducer;
