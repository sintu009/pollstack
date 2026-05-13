import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { templateAPI } from "../../services/api";

export const fetchTemplates = createAsyncThunk("templates/fetchAll", async (_, { rejectWithValue }) => {
  try { return await templateAPI.getAll(); } catch (err) { return rejectWithValue(err.message); }
});

export const createTemplate = createAsyncThunk("templates/create", async (data, { rejectWithValue }) => {
  try { return await templateAPI.create(data); } catch (err) { return rejectWithValue(err.message); }
});

export const deleteTemplate = createAsyncThunk("templates/delete", async (id, { rejectWithValue }) => {
  try { await templateAPI.delete(id); return id; } catch (err) { return rejectWithValue(err.message); }
});

const templateSlice = createSlice({
  name: "templates",
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTemplates.pending, (state) => { state.loading = true; })
      .addCase(fetchTemplates.fulfilled, (state, { payload }) => { state.loading = false; state.list = payload; })
      .addCase(fetchTemplates.rejected, (state, { payload }) => { state.loading = false; state.error = payload; })
      .addCase(createTemplate.fulfilled, (state, { payload }) => { state.list.unshift(payload); })
      .addCase(deleteTemplate.fulfilled, (state, { payload }) => {
        state.list = state.list.filter((t) => t._id !== payload);
      });
  },
});

export default templateSlice.reducer;
