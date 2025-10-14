import { Router } from "express";
import {
  createOrder,
  verifyPayment,
  getSubscriptionStatus,
  getUsageStats,
} from "../controllers/payment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// All payment routes require authentication
router.use(verifyJWT);

router.route("/create-order").post(createOrder);
router.route("/verify").post(verifyPayment);
router.route("/status").get(getSubscriptionStatus);
router.route("/usage").get(getUsageStats);

export default router;