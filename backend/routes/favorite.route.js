import express from "express";
import {
  addToFavorites,
  removeFromFavorites,
  getFavorites,
  checkFavorite,
} from "../controllers/favorite.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyJWT);

router.route("/").post(addToFavorites).get(getFavorites);
router.route("/:templateId").delete(removeFromFavorites);
router.route("/check/:templateId").get(checkFavorite);

export default router;