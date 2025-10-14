import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const getTemplates = createAsyncThunk(
  "template/getTemplates",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams ? `/api/v1/templates?${queryParams}` : "/api/v1/templates";
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data.templates;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add this new thunk to fetch a single template
export const getTemplateById = createAsyncThunk(
  "template/getTemplateById",
  async (id, { rejectWithValue }) => {
    try {
      // Note: No credentials needed if it's a public route
      const response = await fetch(`/api/v1/templates/${id}`);
      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data.template;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create Template (Admin only)
export const createTemplate = createAsyncThunk(
  "template/createTemplate",
  async (templateData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('title', templateData.title);
      formData.append('excalidrawJSON', templateData.excalidrawJSON);
      formData.append('category', templateData.category);
      if (templateData.tags) {
        formData.append('tags', templateData.tags);
      }
      if (templateData.thumbnail) {
        formData.append('thumbnail', templateData.thumbnail);
      }

      const response = await fetch('/api/v1/templates/create', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) return rejectWithValue(data);
      return data.template;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  templates: [],
  currentTemplate: null, // Add this to hold the loaded template
  loading: false,
  error: null,
};

const templateSlice = createSlice({
  name: "template",
  initialState,
  reducers: {
    // Add a reducer to clear the current template
    clearCurrentTemplate: (state) => {
      state.currentTemplate = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get All Templates
      .addCase(getTemplates.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
      })
      .addCase(getTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Template By ID
      .addCase(getTemplateById.pending, (state) => {
        state.loading = true;
      })
      .addCase(getTemplateById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentTemplate = action.payload;
      })
      .addCase(getTemplateById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Template
      .addCase(createTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(createTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates.unshift(action.payload); // Add new template to the beginning
      })
      .addCase(createTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentTemplate } = templateSlice.actions;
export default templateSlice.reducer;