import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js"
import fundamentalRoute from "./routes/fundamental.route.js"
import marketRoute from "./routes/market.route.js"
// import routes from "./api/route.js";

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/stock-price-predictor")

app.use(cors());
app.use(express.json());

app.use("/api", authRoute);
app.use("/api/fundamental", fundamentalRoute);
app.use("/api/market", marketRoute);


app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default app;