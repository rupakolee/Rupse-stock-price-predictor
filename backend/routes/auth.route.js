import express from "express"
import { userReg, userLogin } from "../controller/auth.controller.js"


const router = express.Router();

router.post("/login", userLogin)

router.post("/register", userReg)

export default router;  