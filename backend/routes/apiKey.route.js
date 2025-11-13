import express from "express";
import { generateApiKey, getApiKeys, deleteApiKey, toggleApiKey } from "../controllers/apiKey.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/").post(generateApiKey).get(getApiKeys);
router.route("/:id").delete(deleteApiKey).patch(toggleApiKey);

export default router;