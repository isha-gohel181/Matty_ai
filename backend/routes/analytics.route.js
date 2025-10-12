import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { getUserAnalytics } from "../controllers/analytics.controller.js";

const router = express.Router();

// User analytics - accessible to all authenticated users
router.route("/user").get(verifyJWT, getUserAnalytics);

export default router;