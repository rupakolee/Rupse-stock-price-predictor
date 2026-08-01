import mongoose from "mongoose";

const predictionSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true },
  horizon: { type: Number, required: true, default: 5 },
  payload: { type: mongoose.Schema.Types.Mixed, required: true },
  updatedAt: { type: Date, default: Date.now },
});

predictionSchema.index({ symbol: 1, horizon: 1 }, { unique: true });

export default mongoose.model("Prediction", predictionSchema);
