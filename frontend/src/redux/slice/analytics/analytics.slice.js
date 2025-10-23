import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../utils/api.js';

export const getUserAnalytics = createAsyncThunk(
  "analytics/getUserAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/analytics/user");
      return response.data.analytics;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  analytics: null,
  loading: false,
  error: null,
};

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {
    clearAnalytics: (state) => {
      state.analytics = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserAnalytics.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.analytics = action.payload;
      })
      .addCase(getUserAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAnalytics } = analyticsSlice.actions;
export default analyticsSlice.reducer;