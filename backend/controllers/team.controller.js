import { Team } from "../models/team.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import ErrorHandler from "../middlewares/error.middleware.js";
import crypto from "crypto";
import { sendEmail } from "../utils/mail.utils.js";

// Create a new team
export const createTeam = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;
  const ownerId = req.user._id;

  if (!name) {
    return next(new ErrorHandler("Team name is required", 400));
  }

  const team = await Team.create({
    name,
    description,
    owner: ownerId,
    members: [{ user: ownerId, role: "admin" }],
  });

  // Add team to user's teams
  await User.findByIdAndUpdate(ownerId, {
    $push: { teams: { team: team._id, role: "owner" } },
  });

  res.status(201).json({
    success: true,
    message: "Team created successfully",
    team,
  });
});

// Get user's teams
export const getUserTeams = asyncHandler(async (req, res, next) => {
  const userId = req.user._id;

  const user = await User.findById(userId).populate({
    path: "teams.team",
    populate: {
      path: "members.user",
      select: "fullName email avatar",
    },
  });

  res.status(200).json({
    success: true,
    teams: user.teams,
  });
});

// Invite member to team
export const inviteMember = asyncHandler(async (req, res, next) => {
  const { teamId } = req.params;
  const { email, role = "member" } = req.body;
  const userId = req.user._id;

  const team = await Team.findById(teamId);
  if (!team) {
    return next(new ErrorHandler("Team not found", 404));
  }

  // Check if user is admin or owner
  const member = team.members.find((m) => m.user.toString() === userId.toString());
  if (!member || (member.role !== "admin" && team.owner.toString() !== userId.toString())) {
    return next(new ErrorHandler("Not authorized to invite members", 403));
  }

  // Find the user being invited by email
  const invitedUser = await User.findOne({ email });
  
  // Check if invited user is already a member
  if (invitedUser) {
    const existingMember = team.members.find((m) => m.user.toString() === invitedUser._id.toString());
    if (existingMember) {
      return next(new ErrorHandler("User is already a member of this team", 400));
    }
  }

  // Check if invitation already exists
  const existingInvitation = team.invitations.find((inv) => inv.email === email);
  if (existingInvitation) {
    return next(new ErrorHandler("Invitation already sent to this email", 400));
  }

  // Generate invitation token
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  team.invitations.push({ email, role, token, expiresAt });
  await team.save();

  // Send invitation email (non-blocking)
  const invitationLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/dashboard/teams/invite/${token}`;
  const emailMessage = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #3b82f6; color: white; padding: 20px; border-radius: 5px 5px 0 0; text-align: center; }
          .content { background-color: #f9fafb; padding: 20px; border-radius: 0 0 5px 5px; }
          .button { 
            display: inline-block; 
            padding: 12px 30px; 
            background-color: #3b82f6; 
            color: white; 
            text-decoration: none; 
            border-radius: 5px; 
            margin: 20px 0;
            font-weight: bold;
          }
          .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 10px; }
          .team-name { color: #3b82f6; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Team Invitation</h1>
          </div>
          <div class="content">
            <p>Hello,</p>
            <p>You've been invited to join the team <span class="team-name">${team.name}</span> on <strong>Matty AI</strong>!</p>
            <p>This is a great opportunity to collaborate and share designs with your team members.</p>
            <p style="text-align: center;">
              <a href="${invitationLink}" class="button">Accept Invitation</a>
            </p>
            <p>Or copy and paste this link in your browser:</p>
            <p style="background-color: #e5e7eb; padding: 10px; border-radius: 3px; word-break: break-all; font-size: 12px;">
              ${invitationLink}
            </p>
            <p style="color: #999; font-size: 12px;">This invitation will expire in 7 days.</p>
            <div class="footer">
              <p>Best regards,<br/>Matty AI Team</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;

  // Send email asynchronously without blocking the response
  setImmediate(async () => {
    try {
      await sendEmail({
        email,
        subject: `You're invited to join ${team.name} on Matty AI`,
        message: emailMessage,
      });
      console.log(`✅ Invitation email sent to ${email}`);
    } catch (emailError) {
      console.error("❌ Failed to send invitation email to", email, ":", emailError.message);
    }
  });

  res.status(200).json({
    success: true,
    message: "Invitation sent successfully",
  });
});

// Accept invitation
export const acceptInvitation = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const userId = req.user._id;

  const team = await Team.findOne({ "invitations.token": token });
  if (!team) {
    return next(new ErrorHandler("Invalid invitation token", 404));
  }

  const invitation = team.invitations.find((inv) => inv.token === token);
  if (!invitation) {
    return next(new ErrorHandler("Invitation not found", 404));
  }

  if (invitation.expiresAt < new Date()) {
    return next(new ErrorHandler("Invitation has expired", 400));
  }

  // Check if user email matches
  if (invitation.email !== req.user.email) {
    return next(new ErrorHandler("Invitation is for a different email", 403));
  }

  // Add user to team
  team.members.push({ user: userId, role: invitation.role });
  team.invitations = team.invitations.filter((inv) => inv.token !== token);
  await team.save();

  // Add team to user's teams
  await User.findByIdAndUpdate(userId, {
    $push: { teams: { team: team._id, role: invitation.role } },
  });

  res.status(200).json({
    success: true,
    message: "Invitation accepted successfully",
    team,
  });
});

// Remove member from team
export const removeMember = asyncHandler(async (req, res, next) => {
  const { teamId, memberId } = req.params;
  const userId = req.user._id;

  const team = await Team.findById(teamId);
  if (!team) {
    return next(new ErrorHandler("Team not found", 404));
  }

  // Check if user is admin or owner
  const member = team.members.find((m) => m.user.toString() === userId.toString());
  if (!member || (member.role !== "admin" && team.owner.toString() !== userId.toString())) {
    return next(new ErrorHandler("Not authorized to remove members", 403));
  }

  // Cannot remove owner
  if (team.owner.toString() === memberId) {
    return next(new ErrorHandler("Cannot remove team owner", 400));
  }

  // Remove from team
  team.members = team.members.filter((m) => m.user.toString() !== memberId);
  await team.save();

  // Remove team from user's teams
  await User.findByIdAndUpdate(memberId, {
    $pull: { teams: { team: teamId } },
  });

  res.status(200).json({
    success: true,
    message: "Member removed successfully",
  });
});

// Update member role
export const updateMemberRole = asyncHandler(async (req, res, next) => {
  const { teamId, memberId } = req.params;
  const { role } = req.body;
  const userId = req.user._id;

  const team = await Team.findById(teamId);
  if (!team) {
    return next(new ErrorHandler("Team not found", 404));
  }

  // Only owner can update roles
  if (team.owner.toString() !== userId.toString()) {
    return next(new ErrorHandler("Only team owner can update roles", 403));
  }

  const member = team.members.find((m) => m.user.toString() === memberId);
  if (!member) {
    return next(new ErrorHandler("Member not found", 404));
  }

  member.role = role;
  await team.save();

  // Update in user's teams
  await User.updateOne(
    { _id: memberId, "teams.team": teamId },
    { $set: { "teams.$.role": role } }
  );

  res.status(200).json({
    success: true,
    message: "Member role updated successfully",
  });
});

// Delete team
export const deleteTeam = asyncHandler(async (req, res, next) => {
  const { teamId } = req.params;
  const userId = req.user._id;

  const team = await Team.findById(teamId);
  if (!team) {
    return next(new ErrorHandler("Team not found", 404));
  }

  if (team.owner.toString() !== userId.toString()) {
    return next(new ErrorHandler("Only team owner can delete the team", 403));
  }

  // Remove team from all members
  await User.updateMany(
    { "teams.team": teamId },
    { $pull: { teams: { team: teamId } } }
  );

  await Team.findByIdAndDelete(teamId);

  res.status(200).json({
    success: true,
    message: "Team deleted successfully",
  });
});

// Update team information
export const updateTeam = asyncHandler(async (req, res, next) => {
  const { teamId } = req.params;
  const { name, description } = req.body;
  const userId = req.user._id;

  const team = await Team.findById(teamId);
  if (!team) {
    return next(new ErrorHandler("Team not found", 404));
  }

  // Only owner can update team
  if (team.owner.toString() !== userId.toString()) {
    return next(new ErrorHandler("Only team owner can update the team", 403));
  }

  if (name) team.name = name;
  if (description !== undefined) team.description = description;

  await team.save();

  res.status(200).json({
    success: true,
    message: "Team updated successfully",
    team,
  });
});

// Leave team
export const leaveTeam = asyncHandler(async (req, res, next) => {
  const { teamId } = req.params;
  const userId = req.user._id;

  const team = await Team.findById(teamId);
  if (!team) {
    return next(new ErrorHandler("Team not found", 404));
  }

  // Owner cannot leave team, must delete it instead
  if (team.owner.toString() === userId.toString()) {
    return next(new ErrorHandler("Team owner cannot leave the team. Please delete the team instead.", 400));
  }

  // Check if user is a member
  const memberIndex = team.members.findIndex((m) => m.user.toString() === userId.toString());
  if (memberIndex === -1) {
    return next(new ErrorHandler("You are not a member of this team", 400));
  }

  // Remove from team
  team.members.splice(memberIndex, 1);
  await team.save();

  // Remove team from user's teams
  await User.findByIdAndUpdate(userId, {
    $pull: { teams: { team: teamId } },
  });

  res.status(200).json({
    success: true,
    message: "Successfully left the team",
  });
});