import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchUserTeams, createTeam, inviteMember, acceptInvitation, removeMember, updateMemberRole, deleteTeam, updateTeam, leaveTeam } from "../../redux/slice/team/teamSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Share2, Edit, LogOut, Trash2, UserMinus, Users, Plus, Zap } from 'lucide-react';
import { toast } from 'sonner';

const TeamsPage = () => {
  const dispatch = useDispatch();
  const { teams, loading } = useSelector(state => state.team);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [editTeamName, setEditTeamName] = useState('');
  const [editTeamDescription, setEditTeamDescription] = useState('');

  useEffect(() => {
    dispatch(fetchUserTeams());
  }, [dispatch]);

  const handleCreateTeam = async () => {
    if (!newTeamName.trim()) return;
    try {
      await dispatch(createTeam({ name: newTeamName, description: newTeamDescription })).unwrap();
      setNewTeamName('');
      setNewTeamDescription('');
      toast.success('Team created successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to create team');
    }
  };

  const handleInviteMember = async (teamId) => {
    if (!inviteEmail.trim()) return;
    try {
      await dispatch(inviteMember({ teamId, email: inviteEmail, role: "member" })).unwrap();
      setInviteEmail('');
      toast.success('Invitation sent successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to send invitation');
    }
  };

  const handleAcceptInvitation = async (token) => {
    try {
      await dispatch(acceptInvitation(token)).unwrap();
      toast.success('Invitation accepted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to accept invitation');
    }
  };

  const handleUpdateTeam = async () => {
    if (!editTeamName.trim()) return;
    try {
      await dispatch(updateTeam({
        teamId: editingTeam._id,
        name: editTeamName,
        description: editTeamDescription
      })).unwrap();
      setEditingTeam(null);
      setEditTeamName('');
      setEditTeamDescription('');
      toast.success('Team updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update team');
    }
  };

  const openEditDialog = (team) => {
    setEditingTeam(team);
    setEditTeamName(team.name);
    setEditTeamDescription(team.description || '');
  };

  const handleLeaveTeam = async (teamId, teamName) => {
    if (!window.confirm(`Are you sure you want to leave "${teamName}"?`)) return;
    try {
      await dispatch(leaveTeam(teamId)).unwrap();
      toast.success('Successfully left the team');
    } catch (error) {
      toast.error(error.message || 'Failed to leave team');
    }
  };

  const handleDeleteTeam = async (teamId, teamName) => {
    if (!window.confirm(`Are you sure you want to delete "${teamName}"? This action cannot be undone and will remove all team data.`)) return;
    try {
      await dispatch(deleteTeam(teamId)).unwrap();
      toast.success('Team deleted successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to delete team');
    }
  };

  const handleRemoveMember = async (teamId, memberId, memberName) => {
    if (!window.confirm(`Are you sure you want to remove ${memberName} from the team?`)) return;
    try {
      await dispatch(removeMember({ teamId, memberId })).unwrap();
      toast.success('Member removed successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to remove member');
    }
  };

  const handleUpdateMemberRole = async (teamId, memberId, newRole, memberName) => {
    try {
      await dispatch(updateMemberRole({ teamId, memberId, role: newRole })).unwrap();
      toast.success(`${memberName}'s role updated to ${newRole}`);
    } catch (error) {
      toast.error(error.message || 'Failed to update member role');
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Teams</h1>
        <p className="text-muted-foreground">Collaborate with your team members and manage shared designs</p>
      </div>

      {/* Create Team Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-8 gap-2">
            <Plus className="h-4 w-4" />
            Create New Team
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Team</DialogTitle>
            <DialogDescription>
              Create a new team by providing a name and optional description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="e.g., Design Team, Marketing Squad"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={newTeamDescription}
              onChange={(e) => setNewTeamDescription(e.target.value)}
            />
            <Button onClick={handleCreateTeam} disabled={loading} className="w-full">
              Create Team
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Team Dialog */}
      <Dialog open={!!editingTeam} onOpenChange={() => setEditingTeam(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Team</DialogTitle>
            <DialogDescription>
              Update the team name and description.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Team Name"
              value={editTeamName}
              onChange={(e) => setEditTeamName(e.target.value)}
            />
            <Input
              placeholder="Description (optional)"
              value={editTeamDescription}
              onChange={(e) => setEditTeamDescription(e.target.value)}
            />
            <Button onClick={handleUpdateTeam} disabled={loading}>
              Update Team
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Teams List */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {teams && teams.length > 0 ? (
          teams.map((teamData) => (
            <Card key={teamData.team._id} className="relative hover:shadow-lg transition-shadow">
              <CardHeader className="relative pb-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{teamData.team.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{teamData.team.description || 'No description'}</p>
                  </div>
                  {/* Edit/Delete Buttons - Top Right Corner */}
                  {teamData.role === 'owner' && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => openEditDialog(teamData.team)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        onClick={() => handleDeleteTeam(teamData.team._id, teamData.team.name)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Team Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1">Role</p>
                    <p className="font-semibold capitalize text-sm">{teamData.role}</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <Users className="h-3 w-3" /> Members
                    </p>
                    <p className="font-semibold text-sm">{teamData.team.members.length}</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2 flex-wrap">
                  {/* View Shared Designs */}
                  <Button asChild variant="outline" size="sm" className="flex-1">
                    <Link to={`/dashboard/team/${teamData.team._id}/shared-designs`}>
                      <Share2 className="h-4 w-4 mr-2" />
                      Shared
                    </Link>
                  </Button>

                  {/* View Details */}
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setSelectedTeam(teamData.team)}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Members
                  </Button>
                </div>

                {/* Leave Team Button - For members and admins, not owners */}
                {teamData.role !== 'owner' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLeaveTeam(teamData.team._id, teamData.team.name)}
                    className="w-full text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Leave Team
                  </Button>
                )}

                {/* Invite Member Dialog */}
                {(teamData.role === 'admin' || teamData.role === 'owner') && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="default" size="sm" className="w-full gap-2">
                        <Plus className="h-4 w-4" />
                        Invite Member
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite Member to {teamData.team.name}</DialogTitle>
                        <DialogDescription>
                          Enter the email address of the person you want to invite to this team.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="Email address"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                        />
                        <Button
                          onClick={() => handleInviteMember(teamData.team._id)}
                          disabled={loading}
                          className="w-full"
                        >
                          Send Invitation
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <div className="flex items-center justify-center min-h-[500px]">
              <div className="text-center max-w-md mx-auto">
                <div className="mb-6 flex justify-center">
                  <Users className="h-16 w-16 text-muted-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-3">No Teams Yet</h2>
                <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                  Get started by creating your first team. Teams allow you to collaborate with others, share designs, and manage projects together.
                </p>
                <div className="space-y-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="w-full gap-2 h-10">
                        <Plus className="h-4 w-4" />
                        Create Your First Team
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Team</DialogTitle>
                        <DialogDescription>
                          Create a new team by providing a name and optional description.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <Input
                          placeholder="e.g., Design Team, Marketing Squad"
                          value={newTeamName}
                          onChange={(e) => setNewTeamName(e.target.value)}
                        />
                        <Input
                          placeholder="Description (optional)"
                          value={newTeamDescription}
                          onChange={(e) => setNewTeamDescription(e.target.value)}
                        />
                        <Button onClick={handleCreateTeam} disabled={loading} className="w-full">
                          Create Team
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <p className="text-xs text-muted-foreground pt-2">
                    💡 Tip: Invite team members to collaborate on designs together
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Team Details Modal */}
      {selectedTeam && (
        <Dialog open={!!selectedTeam} onOpenChange={() => setSelectedTeam(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedTeam.name}</DialogTitle>
              <DialogDescription>
                View team details including members and their roles.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <p>{selectedTeam.description}</p>
              <h3 className="font-semibold">Members:</h3>
              <div className="space-y-2">
                {selectedTeam.members.map((member) => (
                  <div key={member._id} className="flex justify-between items-center p-3 rounded-lg border">
                    <div>
                      <p className="font-medium">{member.user.fullName}</p>
                      <p className="text-sm text-gray-600">{member.user.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Select
                        value={member.role}
                        onValueChange={(newRole) => handleUpdateMemberRole(selectedTeam._id, member._id, newRole, member.user.fullName)}
                        disabled={loading || member.role === 'owner'}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="member">Member</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="owner">Owner</SelectItem>
                        </SelectContent>
                      </Select>
                      {(teams.find(t => t.team._id === selectedTeam._id)?.role === 'owner' || 
                        teams.find(t => t.team._id === selectedTeam._id)?.role === 'admin') && 
                       member.role !== 'owner' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700"
                          onClick={() => handleRemoveMember(selectedTeam._id, member._id, member.user.fullName)}
                          disabled={loading}
                        >
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default TeamsPage;