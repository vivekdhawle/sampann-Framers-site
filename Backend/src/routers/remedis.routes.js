import { Router } from "express";
import { getRemedies } from "../controllers/remedies.controller.js";

const router=Router()
router.route("/getremedies").get(getRemedies)

export default router