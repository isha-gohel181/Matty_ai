import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/utils/api';

// ============================================================================
// Async Thunks
// ============================================================================

// Register User
export const registerUser = createAsyncThunk(
  'user/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/users/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/users/login', credentials);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Logout User
export const logoutUser = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/users/logout');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Refresh Access Token
export const refreshAccessToken = createAsyncThunk(
  'user/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/users/refresh-token');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Get Logged-in User Info
export const getLoggedInUserInfo = createAsyncThunk(
  'user/getUserInfo',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/users/dashboard');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Send OTP
export const sendOtpToUser = createAsyncThunk(
  'user/sendOtp',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/users/otp/send');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Verify OTP
export const verifyOtpForUser = createAsyncThunk(
  'user/verifyOtp',
  async (otpData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/users/otp/verify', otpData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Send Reset Password Link
export const sendResetPasswordLinkToUser = createAsyncThunk(
  'user/sendResetLink',
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/users/password/reset', { email });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Reset Password
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ token, password }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/users/reset-password/${token}`, { password });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Change Current Password
export const changeCurrentPassword = createAsyncThunk(
  'user/changePassword',
  async (passwordData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/users/password/update', passwordData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Update User Profile
export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/users/profile/update', profileData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Update User Avatar
export const updateUserAvatar = createAsyncThunk(
  'user/updateAvatar',
  async (avatarFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await api.post('/api/v1/users/profile/avatar/update', formData, {
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

// Delete User
export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.delete('/api/v1/users/profile/delete');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ============================================================================
// Slice Definition
// ============================================================================

const initialState = {
  // User Data
  user: null,
  accessToken: null,
  refreshToken: null,
  
  // Loading States
  loading: false, // General loading
  authLoading: false, // Authentication specific loading
  profileLoading: false, // Profile update loading
  avatarLoading: false, // Avatar upload loading
  passwordLoading: false, // Password operations loading
  otpLoading: false, // OTP operations loading
  
  // Error States
  error: null,
  success: false,
  
  // Messages
  message: null,
  
  // Specific operation states
  isRegistered: false,
  isVerified: false,
  isPasswordReset: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    // Clear messages and errors
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    
    // Clear user state (useful for logout without API call)
    clearUser: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isVerified = false;
      state.isRegistered = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
    
    // Set tokens manually (if needed)
    setTokens: (state, action) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },
    
    // Reset specific states
    resetAuthState: (state) => {
      state.isRegistered = false;
      state.isPasswordReset = false;
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ======================================================================
      // Register User
      // ======================================================================
      .addCase(registerUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.isRegistered = true;
        state.success = true;
        state.message = action.payload.message || 'Registration successful!';
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload?.message || 'Registration failed';
        state.success = false;
        state.isRegistered = false;
      })

      // ======================================================================
      // Login User
      // ======================================================================
      .addCase(loginUser.pending, (state) => {
        state.authLoading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authLoading = false;
        state.user = action.payload.data.user;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.success = true;
        state.message = action.payload.message || 'Login successful!';
        // Store tokens in localStorage
        if (action.payload.data.accessToken) {
          localStorage.setItem('accessToken', action.payload.data.accessToken);
        }
        if (action.payload.data.refreshToken) {
          localStorage.setItem('refreshToken', action.payload.data.refreshToken);
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authLoading = false;
        state.error = action.payload?.message || 'Login failed';
        state.success = false;
      })

      // ======================================================================
      // Logout User
      // ======================================================================
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.isVerified = false;
        state.isRegistered = false;
        state.success = true;
        state.message = 'Logged out successfully!';
        // Remove tokens from localStorage
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Logout failed';
        // Still clear user data even if API call fails
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      })

      // ======================================================================
      // Refresh Access Token
      // ======================================================================
      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false;
        state.accessToken = action.payload.data.accessToken;
        state.refreshToken = action.payload.data.refreshToken;
        state.success = true;
      })
      .addCase(refreshAccessToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Token refresh failed';
        state.accessToken = null;
        state.refreshToken = null;
      })

      // ======================================================================
      // Get Logged-in User Info
      // ======================================================================
      .addCase(getLoggedInUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getLoggedInUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        // Set accessToken from localStorage if available
        const token = localStorage.getItem('accessToken');
        if (token) {
          state.accessToken = token;
        }
        state.success = true;
      })
      .addCase(getLoggedInUserInfo.rejected, (state, action) => {
        state.loading = false;
        // If API call fails but we have a token in localStorage, still consider user authenticated
        // This handles cases where backend is temporarily unavailable
        const token = localStorage.getItem('accessToken');
        if (token) {
          state.accessToken = token;
          // Don't set user data, but keep authentication state
          state.error = 'Unable to fetch user data. Some features may be limited.';
        } else {
          // No token, clear authentication state
          state.user = null;
          state.accessToken = null;
          state.refreshToken = null;
          state.error = action.payload?.message || 'Failed to fetch user info';
        }
      })

      // ======================================================================
      // Send OTP
      // ======================================================================
      .addCase(sendOtpToUser.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(sendOtpToUser.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.success = true;
        state.message = action.payload.message || 'OTP sent successfully!';
      })
      .addCase(sendOtpToUser.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload?.message || 'Failed to send OTP';
        state.success = false;
      })

      // ======================================================================
      // Verify OTP
      // ======================================================================
      .addCase(verifyOtpForUser.pending, (state) => {
        state.otpLoading = true;
        state.error = null;
      })
      .addCase(verifyOtpForUser.fulfilled, (state, action) => {
        state.otpLoading = false;
        state.user = action.payload.data.user;
        state.isVerified = true;
        state.success = true;
        state.message = action.payload.message || 'Email verified successfully!';
      })
      .addCase(verifyOtpForUser.rejected, (state, action) => {
        state.otpLoading = false;
        state.error = action.payload?.message || 'OTP verification failed';
        state.isVerified = false;
        state.success = false;
      })

      // ======================================================================
      // Send Reset Password Link
      // ======================================================================
      .addCase(sendResetPasswordLinkToUser.pending, (state) => {
        state.passwordLoading = true;
        state.error = null;
        state.message = null;
      })
      .addCase(sendResetPasswordLinkToUser.fulfilled, (state, action) => {
        state.passwordLoading = false;
        state.success = true;
        state.message = action.payload.message || 'Reset link sent successfully!';
      })
      .addCase(sendResetPasswordLinkToUser.rejected, (state, action) => {
        state.passwordLoading = false;
        state.error = action.payload?.message || 'Failed to send reset link';
        state.success = false;
      })

      // ======================================================================
      // Reset Password
      // ======================================================================
      .addCase(resetPassword.pending, (state) => {
        state.passwordLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.passwordLoading = false;
        state.isPasswordReset = true;
        state.success = true;
        state.message = action.payload.message || 'Password reset successfully!';
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.error = action.payload?.message || 'Password reset failed';
        state.isPasswordReset = false;
        state.success = false;
      })

      // ======================================================================
      // Change Current Password
      // ======================================================================
      .addCase(changeCurrentPassword.pending, (state) => {
        state.passwordLoading = true;
        state.error = null;
      })
      .addCase(changeCurrentPassword.fulfilled, (state, action) => {
        state.passwordLoading = false;
        state.success = true;
        state.message = action.payload.message || 'Password changed successfully!';
      })
      .addCase(changeCurrentPassword.rejected, (state, action) => {
        state.passwordLoading = false;
        state.error = action.payload?.message || 'Password change failed';
        state.success = false;
      })

      // ======================================================================
      // Update User Profile
      // ======================================================================
      .addCase(updateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.user = action.payload.data.user;
        state.success = true;
        state.message = action.payload.message || 'Profile updated successfully!';
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload?.message || 'Profile update failed';
        state.success = false;
      })

      // ======================================================================
      // Update User Avatar
      // ======================================================================
      .addCase(updateUserAvatar.pending, (state) => {
        state.avatarLoading = true;
        state.error = null;
      })
      .addCase(updateUserAvatar.fulfilled, (state, action) => {
        state.avatarLoading = false;
        state.user = action.payload.data.user;
        state.success = true;
        state.message = action.payload.message || 'Avatar updated successfully!';
      })
      .addCase(updateUserAvatar.rejected, (state, action) => {
        state.avatarLoading = false;
        state.error = action.payload?.message || 'Avatar update failed';
        state.success = false;
      })

      // ======================================================================
      // Delete User
      // ======================================================================
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
        state.success = true;
        state.message = 'Account deleted successfully!';
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Account deletion failed';
        state.success = false;
      });
  },
});

// ============================================================================
// Export Actions and Reducer
// ============================================================================

export const { 
  clearError, 
  clearUser, 
  setTokens, 
  resetAuthState 
} = userSlice.actions;

export default userSlice.reducer;

// ============================================================================
// Selectors
// ============================================================================

export const selectUser = (state) => state.user.user;
export const selectAccessToken = (state) => state.user.accessToken;
export const selectRefreshToken = (state) => state.user.refreshToken;
export const selectIsAuthenticated = (state) => !!state.user.accessToken;
export const selectIsVerified = (state) => state.user.isVerified;
export const selectIsRegistered = (state) => state.user.isRegistered;

// Loading Selectors
export const selectLoading = (state) => state.user.loading;
export const selectAuthLoading = (state) => state.user.authLoading;
export const selectProfileLoading = (state) => state.user.profileLoading;
export const selectAvatarLoading = (state) => state.user.avatarLoading;
export const selectPasswordLoading = (state) => state.user.passwordLoading;
export const selectOtpLoading = (state) => state.user.otpLoading;

// Status Selectors
export const selectError = (state) => state.user.error;
export const selectSuccess = (state) => state.user.success;
export const selectMessage = (state) => state.user.message;
export const selectIsPasswordReset = (state) => state.user.isPasswordReset;
