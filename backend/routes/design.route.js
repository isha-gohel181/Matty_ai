import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createDesign,
  getMyDesigns,
  getDesignById,
  updateDesign,
  deleteDesign,
} from "../controllers/design.controller.js";

const router = express.Router();

// All routes are protected
router.use(verifyJWT);

router
  .route("/")
  .post(upload.single("thumbnail"), createDesign)
  .get(getMyDesigns);

router
  .route("/:id")
  .get(getDesignById)
  .put(upload.single("thumbnail"), updateDesign)
  .delete(deleteDesign);

export default router;