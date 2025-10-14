import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getDesignSuggestions = createAsyncThunk(
  'ai/getDesignSuggestions',
  async (prompt, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/ai/suggestions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data.suggestions;
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

      const response = await fetch('/api/v1/ai/palette', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data.palette;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  suggestions: null,
  palette: null,
  loading: false,
  error: null,
};

const aiSlice = createSlice({
  name: 'ai',
  initialState,
  reducers: {
    clearSuggestions: (state) => {
      state.suggestions = null;
      state.error = null;
    },
    clearPalette: (state) => {
      state.palette = null;
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
        state.suggestions = action.payload;
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

export const { clearSuggestions, clearPalette } = aiSlice.actions;

export default aiSlice.reducer;