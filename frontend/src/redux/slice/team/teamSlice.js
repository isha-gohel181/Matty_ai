import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../../utils/api.js';

// Async thunks
export const fetchUserTeams = createAsyncThunk(
  'team/fetchUserTeams',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/v1/teams');
      return response.data.teams;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch teams');
    }
  }
);

export const createTeam = createAsyncThunk(
  'team/createTeam',
  async (teamData, { rejectWithValue }) => {
    try {
      const response = await api.post('/api/v1/teams', teamData);
      return response.data.team;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create team');
    }
  }
);

export const inviteMember = createAsyncThunk(
  'team/inviteMember',
  async ({ teamId, email, role }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/api/v1/teams/${teamId}/invite`, { email, role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to send invitation');
    }
  }
);

export const acceptInvitation = createAsyncThunk(
  'team/acceptInvitation',
  async (token, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/api/v1/teams/invite/${token}`);
      dispatch(fetchUserTeams()); // Refetch teams after accepting
      return response.data.team;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to accept invitation');
    }
  }
);

export const removeMember = createAsyncThunk(
  'team/removeMember',
  async ({ teamId, memberId }, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/v1/teams/${teamId}/members/${memberId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove member');
    }
  }
);

export const updateMemberRole = createAsyncThunk(
  'team/updateMemberRole',
  async ({ teamId, memberId, role }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/teams/${teamId}/members/${memberId}`, { role });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update member role');
    }
  }
);

export const deleteTeam = createAsyncThunk(
  'team/deleteTeam',
  async (teamId, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/api/v1/teams/${teamId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete team');
    }
  }
);

export const updateTeam = createAsyncThunk(
  'team/updateTeam',
  async ({ teamId, name, description }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/api/v1/teams/${teamId}`, { name, description });
      return response.data.team;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update team');
    }
  }
);

export const leaveTeam = createAsyncThunk(
  'team/leaveTeam',
  async (teamId, { rejectWithValue, dispatch }) => {
    try {
      const response = await api.post(`/api/v1/teams/${teamId}/leave`);
      dispatch(fetchUserTeams()); // Refetch teams after leaving
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to leave team');
    }
  }
);

const teamSlice = createSlice({
  name: 'team',
  initialState: {
    teams: [],
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
      // Fetch user teams
      .addCase(fetchUserTeams.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserTeams.fulfilled, (state, action) => {
        state.loading = false;
        state.teams = action.payload;
      })
      .addCase(fetchUserTeams.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create team
      .addCase(createTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTeam.fulfilled, (state, action) => {
        state.loading = false;
        // Format the team object to match the structure expected by the teams list
        state.teams.push({ team: action.payload, role: 'owner' });
      })
      .addCase(createTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Other cases...
      .addCase(inviteMember.pending, (state) => {
        state.loading = true;
      })
      .addCase(inviteMember.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(inviteMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptInvitation.pending, (state) => {
        state.loading = true;
      })
      .addCase(acceptInvitation.fulfilled, (state) => {
        state.loading = false;
        // Refetch teams after accepting invitation
      })
      .addCase(acceptInvitation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update team
      .addCase(updateTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTeam.fulfilled, (state, action) => {
        state.loading = false;
        // Update the team in the teams array
        const updatedTeam = action.payload;
        const index = state.teams.findIndex(t => t.team._id === updatedTeam._id);
        if (index !== -1) {
          state.teams[index].team = updatedTeam;
        }
      })
      .addCase(updateTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Leave team
      .addCase(leaveTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveTeam.fulfilled, (state) => {
        state.loading = false;
        // Teams will be refetched by the dispatch in the thunk
      })
      .addCase(leaveTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete team
      .addCase(deleteTeam.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTeam.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted team from the teams array
        state.teams = state.teams.filter(t => t.team._id !== action.meta.arg);
      })
      .addCase(deleteTeam.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove member
      .addCase(removeMember.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeMember.fulfilled, (state, action) => {
        state.loading = false;
        // Update the team members in the teams array
        const { teamId, memberId } = action.meta.arg;
        const teamIndex = state.teams.findIndex(t => t.team._id === teamId);
        if (teamIndex !== -1) {
          state.teams[teamIndex].team.members = state.teams[teamIndex].team.members.filter(m => m._id !== memberId);
        }
      })
      .addCase(removeMember.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update member role
      .addCase(updateMemberRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMemberRole.fulfilled, (state, action) => {
        state.loading = false;
        // Update the member role in the teams array
        const { teamId, memberId, role } = action.meta.arg;
        const teamIndex = state.teams.findIndex(t => t.team._id === teamId);
        if (teamIndex !== -1) {
          const memberIndex = state.teams[teamIndex].team.members.findIndex(m => m._id === memberId);
          if (memberIndex !== -1) {
            state.teams[teamIndex].team.members[memberIndex].role = role;
          }
        }
      })
      .addCase(updateMemberRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = teamSlice.actions;
export default teamSlice.reducer;