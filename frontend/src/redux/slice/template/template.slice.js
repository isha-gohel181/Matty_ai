import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../../utils/api.js';

export const getTemplates = createAsyncThunk(
  "template/getTemplates",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await api.get("/api/v1/templates", { params: filters });
      return response.data.templates;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Add this new thunk to fetch a single template
export const getTemplateById = createAsyncThunk(
  "template/getTemplateById",
  async (id, { rejectWithValue }) => {
    try {
      // Note: No credentials needed if it's a public route
      const response = await api.get(`/api/v1/templates/${id}`);
      return response.data.template;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
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

      const response = await api.post('/api/v1/templates/create', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.template;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Generate Template Data using AI
export const generateTemplateData = createAsyncThunk(
  "template/generateTemplateData",
  async (description, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/ai/generate-template', { description });
      return response.data.templateData;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Update Template (Admin only)
export const updateTemplate = createAsyncThunk(
  "template/updateTemplate",
  async ({ id, templateData }, { rejectWithValue }) => {
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

      const response = await api.put(`/api/v1/templates/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data.template;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Delete Template (Admin only)
export const deleteTemplate = createAsyncThunk(
  "template/deleteTemplate",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/v1/templates/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
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
      })
      // Generate Template Data
      .addCase(generateTemplateData.pending, (state) => {
        state.loading = true;
      })
      .addCase(generateTemplateData.fulfilled, (state, action) => {
        state.loading = false;
        // The generated data will be used in the component
      })
      .addCase(generateTemplateData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Template
      .addCase(updateTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTemplate.fulfilled, (state, action) => {
        state.loading = false;
        const updatedTemplate = action.payload;
        const index = state.templates.findIndex(template => template._id === updatedTemplate._id);
        if (index !== -1) {
          state.templates[index] = updatedTemplate;
        }
      })
      .addCase(updateTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Template
      .addCase(deleteTemplate.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteTemplate.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = state.templates.filter(template => template._id !== action.payload);
      })
      .addCase(deleteTemplate.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentTemplate } = templateSlice.actions;
export default templateSlice.reducer;