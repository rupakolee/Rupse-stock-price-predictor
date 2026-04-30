import express from "express"
import mongoose from "mongoose"
import cors from "cors";
import routes from "./api/route.js"

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/stock-price-predictor")

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default app;