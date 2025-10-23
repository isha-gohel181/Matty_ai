import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../utils/api.js';

// Async Thunks
export const createDesign = createAsyncThunk(
  "design/create",
  async (designData, { rejectWithValue }) => {
    try {
      const response = await api.post("/api/v1/designs", designData, {
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

export const getMyDesigns = createAsyncThunk(
  "design/getMyDesigns",
  async (searchQuery = "", { rejectWithValue }) => {
    try {
      const params = searchQuery ? { search: searchQuery } : {};
      const response = await api.get("/api/v1/designs", { params });
      return response.data.designs;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const getDesignById = createAsyncThunk(
  "design/getDesignById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/api/v1/designs/${id}`);
      return response.data.design;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

export const updateDesign = createAsyncThunk(
  "design/update",
  async ({ id, designData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/api/v1/designs/${id}`, designData, {
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

export const deleteDesign = createAsyncThunk(
  "design/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/v1/designs/${id}`);
      return id; // Return the ID of the deleted design
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);


const initialState = {
  designs: [],
  currentDesign: null,
  loading: false,
  error: null,
};

const designSlice = createSlice({
  name: "design",
  initialState,
  reducers: {
    clearCurrentDesign: (state) => {
      state.currentDesign = null;
    },
    clearDesigns: (state) => {
      state.designs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Design
      .addCase(createDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(createDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.designs.unshift(action.payload.design);
      })
      .addCase(createDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get My Designs
      .addCase(getMyDesigns.pending, (state) => {
        state.loading = true;
      })
      .addCase(getMyDesigns.fulfilled, (state, action) => {
        state.loading = false;
        state.designs = action.payload;
      })
      .addCase(getMyDesigns.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Design By Id
      .addCase(getDesignById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getDesignById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDesign = action.payload;
      })
      .addCase(getDesignById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Design
      .addCase(updateDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateDesign.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.designs.findIndex(
          (d) => d._id === action.payload.design._id
        );
        if (index !== -1) {
          state.designs[index] = action.payload.design;
        }
      })
      .addCase(updateDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Design
      .addCase(deleteDesign.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteDesign.fulfilled, (state, action) => {
        state.loading = false;
        state.designs = state.designs.filter((d) => d._id !== action.payload);
      })
      .addCase(deleteDesign.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentDesign, clearDesigns } = designSlice.actions;

export default designSlice.reducer;