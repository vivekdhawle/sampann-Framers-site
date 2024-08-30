import { Router } from "express";
import { getPlants } from "../controllers/plants.controller.js";

const router =Router()

router.route("/getplant").get(getPlants)

export default router