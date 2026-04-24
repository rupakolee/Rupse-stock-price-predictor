import express from "express"
import mongoose from "mongoose"
import cors from "cors";
import routes from "./api/route.js"

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017/rupse-stock")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
});
const User = mongoose.model("User", userSchema);

// Route to insert

app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

app.get("/add", async (req, res) => {
  const user = await User.create({
    name: "Test User",
    email: "test@example.com"
  });

  res.json(user);
});

export default app;