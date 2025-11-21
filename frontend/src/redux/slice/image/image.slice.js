// frontend/src/redux/slice/image/image.slice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../utils/api.js';

export const uploadImage = createAsyncThunk(
  "image/upload",
  async (imageData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image", imageData);

      const response = await api.post('/api/v1/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
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
