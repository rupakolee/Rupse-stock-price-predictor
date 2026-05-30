import mongoose from "mongoose";
import fundamentalModel from "./fundamental.model.js";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  isAdmin: Boolean
});

export const User = mongoose.model("User", userSchema);
export const Fundamental = fundamentalModel;
