import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ============================================================================
// Async Thunks
// ============================================================================

// Get My Activity Logs (User)
export const getMyActivityLogs = createAsyncThunk(
  'activityLog/getMyActivityLogs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/v1/activity/my', {
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

// Get All Activity Logs (Admin)
export const getAllActivityLogs = createAsyncThunk(
  'activityLog/getAllActivityLogs',
  async (filters = {}, { rejectWithValue }) => {
    try {
      // Build query string from filters
      const queryParams = new URLSearchParams();
      if (filters.userId) queryParams.append('userId', filters.userId);
      if (filters.action) queryParams.append('action', filters.action);
      if (filters.limit) queryParams.append('limit', filters.limit);
      if (filters.page) queryParams.append('page', filters.page);

      const queryString = queryParams.toString();
      const url = queryString 
        ? `/api/v1/activity/all?${queryString}`
        : '/api/v1/activity/all';

      const response = await fetch(url, {
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

// Clear User Logs (Admin)
export const clearUserLogs = createAsyncThunk(
  'activityLog/clearUserLogs',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/v1/activity/clear/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data);
      }

      return { ...data, clearedUserId: userId };
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: error.message });
    }
  }
);

// ============================================================================
// Slice Definition
// ============================================================================

const initialState = {
  // Activity Data
  myActivities: [], // Current user's activities
  allActivityLogs: [], // All logs (admin view)
  userActivityLogs: [], // Specific user's logs (admin view)
  
  // Loading States
  loading: false, // General loading
  myActivitiesLoading: false, // User's own activities loading
  allActivitiesLoading: false, // All activities loading (admin)
  userActivitiesLoading: false, // Specific user activities loading
  clearingLogsLoading: false, // Clear logs operation loading
  
  // Error States
  error: null,
  success: false,
  
  // Messages
  message: null,
  
  // Filters and Pagination
  filters: {
    userId: null,
    action: null,
    dateRange: null,
  },
  pagination: {
    totalActivities: 0,
    page: 1,
    limit: 50,
    totalPages: 1,
  },
  
  // Stats (for quick overview)
  stats: {
    totalUsersWithLogs: 0,
    totalActivities: 0,
    recentActivityCount: 0,
  },
};

const activityLogSlice = createSlice({
  name: 'activityLog',
  initialState,
  reducers: {
    // Clear messages and errors
    clearError: (state) => {
      state.error = null;
      state.message = null;
    },
    
    // Clear user activities
    clearMyActivities: (state) => {
      state.myActivities = [];
    },
    
    // Clear all activities (admin)
    clearAllActivities: (state) => {
      state.allActivityLogs = [];
      state.userActivityLogs = [];
    },
    
    // Set filters
    setActivityFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    
    // Clear filters
    clearActivityFilters: (state) => {
      state.filters = {
        userId: null,
        action: null,
        dateRange: null,
      };
    },
    
    // Add activity locally (for real-time updates)
    addActivity: (state, action) => {
      const newActivity = action.payload;
      
      // Add to my activities (if it's the current user)
      if (newActivity.user?._id === state.currentUserId) {
        state.myActivities.unshift(newActivity);
        // Keep only last 50 activities
        if (state.myActivities.length > 50) {
          state.myActivities = state.myActivities.slice(0, 50);
        }
      }
      
      // Add to all activities (admin view)
      state.allActivityLogs.forEach(log => {
        if (log.user?._id === newActivity.user?._id) {
          log.activities.unshift(newActivity);
          // Keep only last 50 activities per user
          if (log.activities.length > 50) {
            log.activities = log.activities.slice(0, 50);
          }
        }
      });
    },
    
    // Reset activity state
    resetActivityState: (state) => {
      state.success = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ======================================================================
      // Get My Activity Logs
      // ======================================================================
      .addCase(getMyActivityLogs.pending, (state) => {
        state.myActivitiesLoading = true;
        state.error = null;
      })
      .addCase(getMyActivityLogs.fulfilled, (state, action) => {
        state.myActivitiesLoading = false;
        state.myActivities = action.payload.activities || [];
        state.success = true;
        state.message = 'Activities fetched successfully!';
      })
      .addCase(getMyActivityLogs.rejected, (state, action) => {
        state.myActivitiesLoading = false;
        state.error = action.payload?.message || 'Failed to fetch activities';
        state.myActivities = [];
      })

      // ======================================================================
      // Get All Activity Logs
      // ======================================================================
      .addCase(getAllActivityLogs.pending, (state) => {
        state.allActivitiesLoading = true;
        state.error = null;
      })
      .addCase(getAllActivityLogs.fulfilled, (state, action) => {
        state.allActivitiesLoading = false;
        state.allActivityLogs = action.payload.logs || [];
        state.success = true;
        state.message = 'All activity logs fetched successfully!';
        
        // Update stats if available
        if (action.payload.stats) {
          state.stats = action.payload.stats;
        }
        
        // Update pagination if available
        if (action.payload.pagination) {
          state.pagination = action.payload.pagination;
        }
      })
      .addCase(getAllActivityLogs.rejected, (state, action) => {
        state.allActivitiesLoading = false;
        state.error = action.payload?.message || 'Failed to fetch activity logs';
        state.allActivityLogs = [];
      })

      // ======================================================================
      // Clear User Logs
      // ======================================================================
      .addCase(clearUserLogs.pending, (state) => {
        state.clearingLogsLoading = true;
        state.error = null;
      })
      .addCase(clearUserLogs.fulfilled, (state, action) => {
        state.clearingLogsLoading = false;
        
        const clearedUserId = action.payload.clearedUserId;
        
        // Remove cleared user from allActivityLogs
        state.allActivityLogs = state.allActivityLogs.filter(
          log => log.user?._id !== clearedUserId
        );
        
        // If we have userActivityLogs for this user, clear them
        if (state.userActivityLogs.some(activity => activity.user?._id === clearedUserId)) {
          state.userActivityLogs = state.userActivityLogs.filter(
            activity => activity.user?._id !== clearedUserId
          );
        }
        
        state.success = true;
        state.message = action.payload.message || 'User logs cleared successfully!';
      })
      .addCase(clearUserLogs.rejected, (state, action) => {
        state.clearingLogsLoading = false;
        state.error = action.payload?.message || 'Failed to clear user logs';
        state.success = false;
      });
  },
});

// ============================================================================
// Export Actions and Reducer
// ============================================================================

export const { 
  clearError, 
  clearMyActivities, 
  clearAllActivities,
  setActivityFilters, 
  clearActivityFilters,
  addActivity,
  resetActivityState 
} = activityLogSlice.actions;

export default activityLogSlice.reducer;

// ============================================================================
// Selectors
// ============================================================================

// Data Selectors
export const selectMyActivities = (state) => state.activityLog.myActivities;
export const selectAllActivityLogs = (state) => state.activityLog.allActivityLogs;
export const selectActivityFilters = (state) => state.activityLog.filters;
export const selectActivityStats = (state) => state.activityLog.stats;
export const selectActivityPagination = (state) => state.activityLog.pagination;

// Loading Selectors
export const selectActivityLoading = (state) => state.activityLog.loading;
export const selectMyActivitiesLoading = (state) => state.activityLog.myActivitiesLoading;
export const selectAllActivitiesLoading = (state) => state.activityLog.allActivitiesLoading;
export const selectUserActivitiesLoading = (state) => state.activityLog.userActivitiesLoading;
export const selectClearingLogsLoading = (state) => state.activityLog.clearingLogsLoading;

// Status Selectors
export const selectActivityError = (state) => state.activityLog.error;
export const selectActivitySuccess = (state) => state.activityLog.success;
export const selectActivityMessage = (state) => state.activityLog.message;

// Derived Selectors
export const selectRecentActivities = (limit = 10) => (state) => 
  state.activityLog.myActivities.slice(0, limit);

export const selectActivitiesByAction = (action) => (state) => 
  state.activityLog.myActivities.filter(activity => activity.action === action);

export const selectActivitiesByDateRange = (startDate, endDate) => (state) => 
  state.activityLog.myActivities.filter(activity => {
    const activityDate = new Date(activity.timestamp);
    return activityDate >= startDate && activityDate <= endDate;
  });

export const selectUserActivityLogs = (userId) => (state) =>
  state.activityLog.allActivityLogs.find(log => log.user?._id === userId);

// ============================================================================
// Utility Functions for Activity Logs
// ============================================================================

// Activity types and descriptions
export const ActivityTypes = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  PROFILE_UPDATE: 'profile_update',
  AVATAR_UPDATE: 'avatar_update',
  PASSWORD_CHANGE: 'password_change',
  EMAIL_VERIFICATION: 'email_verification',
  ROLE_CHANGE: 'role_change',
  ACCOUNT_DELETION: 'account_deletion',
  ADMIN_ACTION: 'admin_action',
};

// Helper to format activity for display
export const formatActivityForDisplay = (activity) => {
  if (!activity) return null;
  
  const getActionDescription = (action, metadata = {}) => {
    const descriptions = {
      [ActivityTypes.LOGIN]: 'Logged in to the system',
      [ActivityTypes.LOGOUT]: 'Logged out of the system',
      [ActivityTypes.PROFILE_UPDATE]: 'Updated profile information',
      [ActivityTypes.AVATAR_UPDATE]: 'Changed profile picture',
      [ActivityTypes.PASSWORD_CHANGE]: 'Changed password',
      [ActivityTypes.EMAIL_VERIFICATION]: 'Verified email address',
      [ActivityTypes.ROLE_CHANGE]: `Role changed to ${metadata.newRole}`,
      [ActivityTypes.ACCOUNT_DELETION]: 'Account deleted',
      [ActivityTypes.ADMIN_ACTION]: `Admin action: ${metadata.action}`,
    };
    
    return descriptions[action] || `Performed action: ${action}`;
  };

  return {
    id: activity._id || activity.id,
    action: activity.action,
    description: getActionDescription(activity.action, activity.metadata),
    timestamp: activity.timestamp,
    metadata: activity.metadata || {},
    ipAddress: activity.ipAddress,
    userAgent: activity.userAgent,
  };
};

// Helper to filter activities
export const filterActivities = (activities, filters) => {
  return activities.filter(activity => {
    if (filters.action && activity.action !== filters.action) return false;
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const description = formatActivityForDisplay(activity).description.toLowerCase();
      return description.includes(searchTerm);
    }
    if (filters.dateRange) {
      const activityDate = new Date(activity.timestamp);
      const startDate = new Date(filters.dateRange.start);
      const endDate = new Date(filters.dateRange.end);
      return activityDate >= startDate && activityDate <= endDate;
    }
    return true;
  });
};

// Helper to group activities by date
export const groupActivitiesByDate = (activities) => {
  const groups = {};
  
  activities.forEach(activity => {
    const date = new Date(activity.timestamp).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(activity);
  });
  
  return groups;
};

// Helper to get activity statistics
export const getActivityStats = (activities) => {
  const stats = {
    total: activities.length,
    byAction: {},
    byHour: {},
    recentCount: activities.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      return activityDate > yesterday;
    }).length,
  };
  
  activities.forEach(activity => {
    // Count by action
    stats.byAction[activity.action] = (stats.byAction[activity.action] || 0) + 1;
    
    // Count by hour
    const hour = new Date(activity.timestamp).getHours();
    stats.byHour[hour] = (stats.byHour[hour] || 0) + 1;
  });
  
  return stats;
};