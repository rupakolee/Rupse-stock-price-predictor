import express from "express";
import { fetchFundamental } from "../controller/fundamental.controller.js"

const router = express.Router();

router.get("/:symbol", fetchFundamental)


export default router;