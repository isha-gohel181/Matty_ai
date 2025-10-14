import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getUserAnalytics = createAsyncThunk(
  "analytics/getUserAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/analytics/user", {
        method: "GET",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data.analytics;
    } catch (error) {
      return rejectWithValue(error.message);
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