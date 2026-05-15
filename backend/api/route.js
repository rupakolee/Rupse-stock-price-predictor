import express from "express"
import userRoutes from "./login/index.js"

const router = express.Router();

router.use("/login", userRoutes);

export default router;