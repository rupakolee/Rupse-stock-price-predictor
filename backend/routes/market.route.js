import express from "express";
import  fetchHistoricalDataFromAPI  from "../controller/market.controller.js"


const router = express.Router();

router.get("/:symbol", fetchHistoricalDataFromAPI)

export default router