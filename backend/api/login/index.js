import express from "express"
import { userReg, userLogin } from "./controller.js"

const router = express.Router();

router.post("/:userId", userLogin)

router.post("/register", userReg)

export default router;