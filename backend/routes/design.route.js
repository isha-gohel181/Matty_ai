import express from "express";
import { verifyAuth } from "../middlewares/combinedAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createDesign,
  getMyDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
  shareDesignWithTeam,
  updateDesignVisibility,
  getTeamSharedDesigns,
} from "../controllers/design.controller.js";

const router = express.Router();

// All routes are protected
router.use(verifyAuth);

router
  .route("/")
  .post(upload.single("thumbnail"), createDesign)
  .get(getMyDesigns);

// Get team's shared designs
router.route("/team/:teamId").get(getTeamSharedDesigns);

router
  .route("/:id")
  .get(getDesignById)
  .put(upload.single("thumbnail"), updateDesign)
  .delete(deleteDesign);

router.route("/:id/share").post(shareDesignWithTeam);
router.route("/:id/visibility").patch(updateDesignVisibility);

export default router;