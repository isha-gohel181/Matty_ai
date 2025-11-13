import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiHelpers } from '../../../utils/apiHelpers.js';

// ============================================================================
// Async Thunks
// ============================================================================

// Generate API Key
export const generateApiKey = createAsyncThunk(
  'apiKey/generate',
  async (keyData, { rejectWithValue }) => {
    const result = await apiHelpers.post('/api/v1/api-keys', keyData);

    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue(result.error);
    }
  }
);

// Get API Keys
export const getApiKeys = createAsyncThunk(
  'apiKey/getAll',
  async (_, { rejectWithValue }) => {
    const result = await apiHelpers.get('/api/v1/api-keys');

    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue(result.error);
    }
  }
);

// Delete API Key
export const deleteApiKey = createAsyncThunk(
  'apiKey/delete',
  async (keyId, { rejectWithValue }) => {
    const result = await apiHelpers.delete(`/api/v1/api-keys/${keyId}`);

    if (result.success) {
      return { id: keyId };
    } else {
      return rejectWithValue(result.error);
    }
  }
);

// Toggle API Key Status
export const toggleApiKey = createAsyncThunk(
  'apiKey/toggle',
  async (keyId, { rejectWithValue }) => {
    const result = await apiHelpers.patch(`/api/v1/api-keys/${keyId}`);

    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue(result.error);
    }
  }
);

// ============================================================================
// Slice
// ============================================================================

const apiKeySlice = createSlice({
  name: 'apiKey',
  initialState: {
    apiKeys: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Generate API Key
      .addCase(generateApiKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateApiKey.fulfilled, (state, action) => {
        state.loading = false;
        state.apiKeys.push(action.payload.apiKey);
      })
      .addCase(generateApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to generate API key';
      })

      // Get API Keys
      .addCase(getApiKeys.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getApiKeys.fulfilled, (state, action) => {
        state.loading = false;
        state.apiKeys = action.payload.apiKeys;
      })
      .addCase(getApiKeys.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch API keys';
      })

      // Delete API Key
      .addCase(deleteApiKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteApiKey.fulfilled, (state, action) => {
        state.loading = false;
        state.apiKeys = state.apiKeys.filter(key => key._id !== action.payload.id);
      })
      .addCase(deleteApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete API key';
      })

      // Toggle API Key
      .addCase(toggleApiKey.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleApiKey.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.apiKeys.findIndex(key => key._id === action.payload.apiKey.id);
        if (index !== -1) {
          state.apiKeys[index] = action.payload.apiKey;
        }
      })
      .addCase(toggleApiKey.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to toggle API key';
      });
  },
});

export const { clearError } = apiKeySlice.actions;

// Selectors
export const selectApiKeys = (state) => state.apiKey.apiKeys;
export const selectApiKeyLoading = (state) => state.apiKey.loading;
export const selectApiKeyError = (state) => state.apiKey.error;

export default apiKeySlice.reducer;