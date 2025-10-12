// frontend/src/redux/slice/image/image.slice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const uploadImage = createAsyncThunk(
  "image/upload",
  async (imageData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", imageData);

      // Explicit backend URL for better proxy handling
      const response = await fetch("http://localhost:3000/api/v1/images/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      // Enhanced error handling
      console.error("Image upload fetch error:", error);
      return rejectWithValue({
        message: "Cannot connect to server. Is the backend running?",
      });
    }
  }
);

const initialState = {
  imageUrl: null,
  loading: false,
  error: null,
};

const imageSlice = createSlice({
  name: "image",
  initialState,
  reducers: {
    clearImageError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.loading = false;
        state.imageUrl = action.payload.imageUrl;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearImageError } = imageSlice.actions;

export default imageSlice.reducer;
