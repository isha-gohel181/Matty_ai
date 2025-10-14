import express from "express";
import {
  createTemplate,
  getTemplates,
  getTemplateById, // Import the new controller
} from "../controllers/template.controller.js";
import { verifyJWT, customRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Get all templates (for all users)
router.route("/").get(getTemplates);

// Get a single template by ID
router.route("/:id").get(getTemplateById); // Add this route

// Create a new template (admin only)
router
  .route("/create")
  .post(
    verifyJWT,
    customRoles("admin"),
    upload.single("thumbnail"),
    createTemplate
  );

export default router;