import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async Thunks
export const createDesign = createAsyncThunk(
  "design/create",
  async (designData, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/v1/designs", {
        method: "POST",
        credentials: "include",
        body: designData,
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getMyDesigns = createAsyncThunk(
  "design/getMyDesigns",
  async (searchQuery = "", { rejectWithValue }) => {
    try {
      const url = searchQuery 
        ? `/api/v1/designs?search=${encodeURIComponent(searchQuery)}`
        : "/api/v1/designs";
      const response = await fetch(url, {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data.designs;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const getDesignById = createAsyncThunk(
  "design/getDesignById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/designs/${id}`, {
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data.design;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateDesign = createAsyncThunk(
  "design/update",
  async ({ id, designData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/designs/${id}`, {
        method: "PUT",
        credentials: "include",
        body: designData,
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteDesign = createAsyncThunk(
  "design/delete",
  async (id, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/designs/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return id; // Return the ID of the deleted design
    } catch (error) {
      return rejectWithValue(error.message);
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