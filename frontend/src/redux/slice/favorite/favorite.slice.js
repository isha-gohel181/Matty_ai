import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addToFavorites = createAsyncThunk(
  "favorite/addToFavorites",
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ templateId }),
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data.favorite;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeFromFavorites = createAsyncThunk(
  "favorite/removeFromFavorites",
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/favorites/${templateId}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return templateId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getFavorites = createAsyncThunk(
  "favorite/getFavorites",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/favorites", {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data.favorites;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const checkFavorite = createAsyncThunk(
  "favorite/checkFavorite",
  async (templateId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/favorites/check/${templateId}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return { templateId, isFavorited: data.isFavorited };
    } catch (error) {
      return rejectWithValue(error.message);
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