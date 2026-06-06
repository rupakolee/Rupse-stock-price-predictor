import express from "express";
import cors from "cors";
import authRoute from "./routes/auth.route.js"
import fundamentalRoute from "./routes/fundamental.route.js"
import predictionRoute from "./routes/prediction.route.js"
import marketRoute from "./routes/market.route.js"
import sentimentRoute from "./routes/sentiment.route.js"
import newsRoute from "./routes/news.route.js"
// import routes from "./api/route.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", authRoute);
app.use("/api/fundamental", fundamentalRoute);
app.use("/api/prediction", predictionRoute);
app.use("/api/market", marketRoute);
app.use("/api/sentiment", sentimentRoute);
app.use("/api/news", newsRoute);


app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default app;