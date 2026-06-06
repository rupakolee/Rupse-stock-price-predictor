import express from "express";
import { fetchSentiment } from "../controller/sentiment.controller.js";

const router = express.Router();

router.get("/:symbol", fetchSentiment);

export default router;
