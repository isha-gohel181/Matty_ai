import express from "express";
import { getDesignSuggestions } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/suggestions").post(getDesignSuggestions);

export default router;