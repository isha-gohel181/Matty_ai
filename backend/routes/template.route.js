import express from "express";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate,
} from "../controllers/template.controller.js";
import { verifyJWT, customRoles } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// Get all templates (for all users)
router.route("/").get(getTemplates);

// Get a single template by ID
router.route("/:id").get(getTemplateById);

// Create a new template (admin only)
router
  .route("/create")
  .post(
    verifyJWT,
    customRoles("admin"),
    upload.single("thumbnail"),
    createTemplate
  );

// Update a template (admin only)
router
  .route("/:id")
  .put(
    verifyJWT,
    customRoles("admin"),
    upload.single("thumbnail"),
    updateTemplate
  );

// Delete a template (admin only)
router
  .route("/:id")
  .delete(
    verifyJWT,
    customRoles("admin"),
    deleteTemplate
  );

export default router;