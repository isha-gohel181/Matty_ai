import express from "express";
import { getDesignSuggestions, generateColorPalette, generateTemplateData } from "../controllers/ai.controller.js";
import { verifyAuth } from "../middlewares/combinedAuth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// All routes require authentication (JWT or API key)
router.use(verifyAuth);

router.route("/suggestions").post(getDesignSuggestions);
router.route("/palette").post(upload.single("image"), generateColorPalette);
router.route("/generate-template").post(generateTemplateData);

export default router;