import { Router } from "express";
import {
  createTeam,
  getUserTeams,
  inviteMember,
  acceptInvitation,
  removeMember,
  updateMemberRole,
  deleteTeam,
  updateTeam,
  leaveTeam,
} from "../controllers/team.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

// Routes with more specific paths FIRST
router.route("/invite/:token").post(acceptInvitation);  // MOVED UP - Specific path first!

// Then routes with dynamic IDs
router.route("/").post(createTeam).get(getUserTeams);
router.route("/:teamId/invite").post(inviteMember);
router.route("/:teamId/leave").post(leaveTeam);
router.route("/:teamId/members/:memberId").delete(removeMember).patch(updateMemberRole);
router.route("/:teamId").delete(deleteTeam).patch(updateTeam);

export default router;