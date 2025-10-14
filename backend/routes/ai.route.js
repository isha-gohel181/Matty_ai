import express from "express";
import { getDesignSuggestions, generateColorPalette } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/suggestions").post(getDesignSuggestions);
router.route("/palette").post(upload.single("image"), generateColorPalette);

export default router;