import express from "express"
import { getUsers, getAdmin } from "./controller.js";

const router = express.Router();

router.get("/getusers", getUsers);
router.get("/getAdmin", getAdmin)

export default router;