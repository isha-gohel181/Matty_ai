import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============================================================================
// Async Thunks
// ============================================================================

// Get All Users
export const getAllUsers = createAsyncThunk(
  'admin/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/admin/users', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Get Single User
export const getOneUser = createAsyncThunk(
  'admin/getOneUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/admin/users/${userId}`, {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Admin Update User Profile
export const adminUpdateUserProfile = createAsyncThunk(
  'admin/updateUserProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/admin/users/${userId}/profile`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(profileData),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Admin Update User Avatar
export const adminUpdateUserAvatar = createAsyncThunk(
  'admin/updateUserAvatar',
  async ({ userId, avatarFile }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const response = await fetch(`/api/v1/admin/users/${userId}/avatar`, {
        method: 'PATCH',
        credentials: 'include',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Admin Delete User
export const adminDeleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/admin/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return { ...data, deletedUserId: userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Admin Change User Role
export const adminChangeUserRole = createAsyncThunk(
  'admin/changeUserRole',
  async ({ userId, role }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/admin/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// Admin Get Stats
export const adminGetStats = createAsyncThunk(
  'admin/getStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/admin/stats', {
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ============================================================================
// Slice Definition
// ============================================================================

const initialState = {
  // Users Data
  users: [],
  currentUser: null,
  stats: null,
  
  // Loading States
  loading: false, // General loading
  usersLoading: false, // Users list loading
  userLoading: false, // Single user operations
  profileLoading: false, // Profile update loading
  avatarLoading: false, // Avatar upload loading
  roleLoading: false, // Role change loading
  statsLoading: false, // Stats loading
  
  // Error States
  error: null,
  success: false,
  
  // Messages
  message: null,
  
  // Pagination
  pagination: {
    totalUsers: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Clear messages and errors
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    
    // Clear current user
    clearCurrentUser: (state) => {
      state.currentUser = null;
    },
    
    // Clear stats
    clearStats: (state) => {
      state.stats = null;
    },
    
    // Set users (for client-side operations if needed)
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    
    // Update user in list (optimistic updates)
    updateUserInList: (state, action) => {
      const updatedUser = action.payload;
      const index = state.users.findIndex(user => user._id === updatedUser._id);
      if (index !== -1) {
        state.users[index] = updatedUser;
      }
    },
    
    // Remove user from list (optimistic updates)
    removeUserFromList: (state, action) => {
      const userId = action.payload;
      state.users = state.users.filter(user => user._id !== userId);
    },
    
    // Reset admin state
    resetAdminState: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ======================================================================
      // Get All Users
      // ======================================================================
      .addCase(getAllUsers.pending, (state) => {
        state.usersLoading = true;
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.allUsers || [];
        state.success = true;
        state.message = action.payload.message || 'Users fetched successfully!';
        
        // Update pagination if available
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.usersLoading = false;
        state.error = action.payload?.message || 'Failed to fetch users';
        state.users = [];
      })

      // ======================================================================
      // Get One User
      // ======================================================================
      .addCase(getOneUser.pending, (state) => {
        state.userLoading = true;
        state.error = null;
      })
      .addCase(getOneUser.fulfilled, (state, action) => {
        state.userLoading = false;
        state.currentUser = action.payload.user;
        state.success = true;
        state.message = action.payload.message || 'User fetched successfully!';
      })
      .addCase(getOneUser.rejected, (state, action) => {
        state.userLoading = false;
        state.error = action.payload?.message || 'Failed to fetch user';
        state.currentUser = null;
      })

      // ======================================================================
      // Admin Update User Profile
      // ======================================================================
      .addCase(adminUpdateUserProfile.pending, (state) => {
        state.profileLoading = true;
        state.error = null;
      })
      .addCase(adminUpdateUserProfile.fulfilled, (state, action) => {
        state.profileLoading = false;
        state.currentUser = action.payload.user;
        
        // Update user in users list if exists
        const updatedUser = action.payload.user;
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        
        state.success = true;
        state.message = action.payload.message || 'User profile updated successfully!';
      })
      .addCase(adminUpdateUserProfile.rejected, (state, action) => {
        state.profileLoading = false;
        state.error = action.payload?.message || 'Failed to update user profile';
        state.success = false;
      })

      // ======================================================================
      // Admin Update User Avatar
      // ======================================================================
      .addCase(adminUpdateUserAvatar.pending, (state) => {
        state.avatarLoading = true;
        state.error = null;
      })
      .addCase(adminUpdateUserAvatar.fulfilled, (state, action) => {
        state.avatarLoading = false;
        state.currentUser = action.payload.user;
        
        // Update user in users list if exists
        const updatedUser = action.payload.user;
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        
        state.success = true;
        state.message = action.payload.message || 'User avatar updated successfully!';
      })
      .addCase(adminUpdateUserAvatar.rejected, (state, action) => {
        state.avatarLoading = false;
        state.error = action.payload?.message || 'Failed to update user avatar';
        state.success = false;
      })

      // ======================================================================
      // Admin Delete User
      // ======================================================================
      .addCase(adminDeleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminDeleteUser.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remove deleted user from users list
        const deletedUserId = action.payload.deletedUserId;
        state.users = state.users.filter(user => user._id !== deletedUserId);
        
        // Clear current user if it was the deleted one
        if (state.currentUser && state.currentUser._id === deletedUserId) {
          state.currentUser = null;
        }
        
        state.success = true;
        state.message = action.payload.message || 'User deleted successfully!';
      })
      .addCase(adminDeleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete user';
        state.success = false;
      })

      // ======================================================================
      // Admin Change User Role
      // ======================================================================
      .addCase(adminChangeUserRole.pending, (state) => {
        state.roleLoading = true;
        state.error = null;
      })
      .addCase(adminChangeUserRole.fulfilled, (state, action) => {
        state.roleLoading = false;
        state.currentUser = action.payload.user;
        
        // Update user in users list if exists
        const updatedUser = action.payload.user;
        const userIndex = state.users.findIndex(user => user._id === updatedUser._id);
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
        
        state.success = true;
        state.message = action.payload.message || 'User role updated successfully!';
      })
      .addCase(adminChangeUserRole.rejected, (state, action) => {
        state.roleLoading = false;
        state.error = action.payload?.message || 'Failed to update user role';
        state.success = false;
      })

      // ======================================================================
      // Admin Get Stats
      // ======================================================================
      .addCase(adminGetStats.pending, (state) => {
        state.statsLoading = true;
        state.error = null;
      })
      .addCase(adminGetStats.fulfilled, (state, action) => {
        state.statsLoading = false;
        state.stats = action.payload.stats || action.payload;
        state.success = true;
        state.message = action.payload.message || 'Stats fetched successfully!';
      })
      .addCase(adminGetStats.rejected, (state, action) => {
        state.statsLoading = false;
        state.error = action.payload?.message || 'Failed to fetch stats';
        state.stats = null;
      });
  },
});

// ============================================================================
// Export Actions and Reducer
// ============================================================================

export const { 
  clearError, 
  clearCurrentUser, 
  clearStats,
  setUsers, 
  updateUserInList,
  removeUserFromList,
  resetAdminState 
} = adminSlice.actions;

export default adminSlice.reducer;

// ============================================================================
// Selectors
// ============================================================================

// Data Selectors
export const selectAdminUsers = (state) => state.admin.users;
export const selectCurrentAdminUser = (state) => state.admin.currentUser;
export const selectAdminStats = (state) => state.admin.stats;
export const selectAdminPagination = (state) => state.admin.pagination;

// Loading Selectors
export const selectAdminLoading = (state) => state.admin.loading;
export const selectAdminUsersLoading = (state) => state.admin.usersLoading;
export const selectAdminUserLoading = (state) => state.admin.userLoading;
export const selectAdminProfileLoading = (state) => state.admin.profileLoading;
export const selectAdminAvatarLoading = (state) => state.admin.avatarLoading;
export const selectAdminRoleLoading = (state) => state.admin.roleLoading;
export const selectAdminStatsLoading = (state) => state.admin.statsLoading;

// Status Selectors
export const selectAdminError = (state) => state.admin.error;
export const selectAdminSuccess = (state) => state.admin.success;
export const selectAdminMessage = (state) => state.admin.message;

// Derived Selectors
export const selectTotalUsers = (state) => state.admin.pagination.totalUsers;
export const selectUsersByRole = (role) => (state) => 
  state.admin.users.filter(user => user.role === role);
export const selectUserById = (userId) => (state) =>
  state.admin.users.find(user => user._id === userId);

// ============================================================================
// Utility Functions for Admin Operations
// ============================================================================

// Helper to format user data for display
export const formatUserForDisplay = (user) => {
  if (!user) return null;
  
  return {
    id: user._id,
    fullName: user.fullName,
    email: user.email,
    phone: user.phone,
    role: user.role,
    isVerified: user.isVerified,
    avatar: user.avatar,
    gender: user.gender,
    socialLinks: user.social_links,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// Helper to filter users
export const filterUsers = (users, filters) => {
  return users.filter(user => {
    if (filters.role && user.role !== filters.role) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      return (
        user.fullName.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.phone.includes(searchTerm)
      );
    }
    if (filters.isVerified !== undefined && user.isVerified !== filters.isVerified) return false;
    return true;
  });
};

// Helper to sort users
export const sortUsers = (users, sortBy, sortOrder = 'asc') => {
  return [...users].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });
};