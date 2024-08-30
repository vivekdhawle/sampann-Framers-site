import { Router } from "express";
import { getUserDetails, loginUser, logout, registerUser } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import verifyJwt from "../middlewares/auth.middleware.js";

const router=Router()

router.route("/register").post(upload.none(),registerUser)
router.route("/login").post(upload.none(),loginUser)
router.route("/logout").get(verifyJwt,logout)
router.route("/getuser").get(verifyJwt,getUserDetails)
export default router