import express from "express";
import { customRoles, verifyJWT } from "../middlewares/auth.middleware.js";

import { upload } from "../middlewares/multer.middleware.js";
import {
    getAllUsers,
    getOneUser,
    adminUpdateUserProfile,
    adminUpdateUserAvatar,
    adminDeleteUser,
    getAdminStats
} from "../controllers/admin.controller.js";

const router = express.Router()


// *all access
router.route("/users").get(verifyJWT, customRoles("admin"), getAllUsers)
router.route("/get/user/all").get(verifyJWT, customRoles("admin"), getAllUsers)
router.route("/get/user/:id").get(verifyJWT, customRoles("admin"), getOneUser)
    .put(verifyJWT, customRoles("admin"), adminUpdateUserProfile)
    .delete(verifyJWT, customRoles("admin"), adminDeleteUser)


router.route("/edit/user/avatar/:id").put(verifyJWT, customRoles("admin"), upload.single("avatar"), adminUpdateUserAvatar)

router.route("/stats").get(verifyJWT, customRoles("admin"), getAdminStats)


export default router;