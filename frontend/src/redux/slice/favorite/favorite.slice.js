import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../utils/api.js';

export const addToFavorites = createAsyncThunk(
  "favorite/addToFavorites",
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/favorites", { templateId });
      return response.data.favorite;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "favorite/removeFromFavorites",
  async (templateId, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/favorites/${templateId}`);
      return templateId;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getFavorites = createAsyncThunk(
  "favorite/getFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/favorites");
      return response.data.favorites;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const checkFavorite = createAsyncThunk(
  "favorite/checkFavorite",
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/favorites/check/${templateId}`);
      return { templateId, isFavorited: response.data.isFavorited };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

const initialState = {
  favorites: [],
  favoriteStatus: {}, // templateId -> boolean
  loading: false,
  error: null,
};

const favoriteSlice = createSlice({
  name: "favorite",
  initialState,
  reducers: {
    clearFavorites: (state) => {
      state.favorites = [];
      state.favoriteStatus = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addToFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteStatus[action.payload.template] = true;
      })
      .addCase(addToFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeFromFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(removeFromFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favoriteStatus[action.payload] = false;
      })
      .addCase(removeFromFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
        // Update favoriteStatus for all templates
        action.payload.forEach(template => {
          state.favoriteStatus[template._id] = true;
        });
      })
      .addCase(getFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkFavorite.fulfilled, (state, action) => {
        state.favoriteStatus[action.payload.templateId] = action.payload.isFavorited;
      });
  },
});

export const { clearFavorites } = favoriteSlice.actions;
export default favoriteSlice.reducer;