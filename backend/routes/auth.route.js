import express from "express"
import { userReg, userLogin, changePassword } from "../controller/auth.controller.js"


const router = express.Router();

router.post("/login", userLogin)

router.post("/register", userReg)

router.post("/change-password", changePassword)

export default router;  