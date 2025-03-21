import { Router } from "express";

import { getSoil } from "../controllers/soil.controller.js";

const router =Router()

router.route("/getsoil").get(getSoil)

export default router