import dotenv from "dotenv";
dotenv.config();
import app from "./app.js"

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
