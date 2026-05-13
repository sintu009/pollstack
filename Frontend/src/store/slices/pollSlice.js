import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { pollAPI } from "../../services/api";

export const fetchMyPolls = createAsyncThunk("polls/fetchMy", async (_, { rejectWithValue }) => {
  try { return await pollAPI.getMyPolls(); } catch (err) { return rejectWithValue(err.message); }
});

export const createPoll = createAsyncThunk("polls/create", async (pollData, { rejectWithValue }) => {
  try { return await pollAPI.create(pollData); } catch (err) { return rejectWithValue(err.message); }
});

export const fetchPollByLink = createAsyncThunk("polls/fetchByLink", async (link, { rejectWithValue }) => {
  try { return await pollAPI.getByLink(link); } catch (err) { return rejectWithValue(err.message); }
});

export const publishPoll = createAsyncThunk("polls/publish", async (id, { rejectWithValue }) => {
  try { return await pollAPI.publish(id); } catch (err) { return rejectWithValue(err.message); }
});

export const togglePollActive = createAsyncThunk("polls/toggle", async (id, { rejectWithValue }) => {
  try { return await pollAPI.toggle(id); } catch (err) { return rejectWithValue(err.message); }
});

const pollSlice = createSlice({
  name: "polls",
  initialState: {
    list: [],
    currentPoll: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentPoll: (state) => { state.currentPoll = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPolls.pending, (state) => { state.loading = true; })
      .addCase(fetchMyPolls.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchMyPolls.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(createPoll.fulfilled, (state, { payload }) => { state.list.unshift(payload); })
      .addCase(fetchPollByLink.pending, (state) => { state.loading = true; })
      .addCase(fetchPollByLink.fulfilled, (state, { payload }) => { state.loading = false; state.currentPoll = payload; })
      .addCase(fetchPollByLink.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(publishPoll.fulfilled, (state, { payload }) => {
        state.list = state.list.map((p) => (p._id === payload._id ? payload : p));
      })
      .addCase(togglePollActive.fulfilled, (state, { payload }) => {
        state.list = state.list.map((p) => (p._id === payload._id ? payload : p));
      });
  },
});

export const { clearCurrentPoll } = pollSlice.actions;
export default pollSlice.reducer;
