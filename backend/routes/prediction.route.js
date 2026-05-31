import express from "express";
import { fetchPrediction } from "../controller/prediction.controller.js";

const router = express.Router();

router.get("/:symbol", fetchPrediction);

export default router;
