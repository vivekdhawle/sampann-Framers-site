import { Router } from "express";
import { post, remove, seeAllPosts, seePost } from "../controllers/post.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
const router=Router()

router.route("/post").post(upload.fields([{
    name:"postImage",
    maxCount:5
}]),post)

router.route("/seepost").get(upload.none(),seePost)
router.route("/seeallpost").get(upload.none(),seeAllPosts)
router.route("/removepost").delete(remove)
export default router