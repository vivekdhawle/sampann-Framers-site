import { Router } from "express";
import { postProduct, remove, seeAllProducts, seeProduct } from "../controllers/vendor.controller.js";
import { upload } from "../middlewares/multer.middleware.js";

const router=Router()
router.route("/post").post(upload.fields([
    {
        name:"productImage",
        maxCount:5
    }
]),postProduct)
router.route("/products").get(seeProduct)
router.route("/allproducts").get(seeAllProducts)
router.route("/removeproduct").get(remove)
export default router