import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api.js';

export const getDesignSuggestions = createAsyncThunk(
  'ai/getDesignSuggestions',
  async ({ prompt, generateTemplate = false }, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/ai/suggestions', { prompt, generateTemplate });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const generateColorPalette = createAsyncThunk(
  'ai/generateColorPalette',
  async (imageFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await api.post('/api/v1/ai/palette', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.palette;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  suggestions: null,
  palette: null,
  template: null,
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = null;
      state.template = null;
      state.error = null;
    },
    clearPalette: (state) => {
      state.palette = null;
      state.error = null;
    },
    clearTemplate: (state) => {
      state.template = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getDesignSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDesignSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        state.suggestions = action.payload.suggestions;
        state.template = action.payload.template || null;
      })
      .addCase(getDesignSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to get suggestions';
      })
      .addCase(generateColorPalette.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateColorPalette.fulfilled, (state, action) => {
        state.loading = false;
        state.palette = action.payload;
      })
      .addCase(generateColorPalette.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to generate palette';
      });
  },
});

export const { clearSuggestions, clearPalette, clearTemplate } = aiSlice.actions;

export default aiSlice.reducer;