import mongoose from "mongoose";

const forecastSchema = new mongoose.Schema({
  symbol: { type: String, required: true, uppercase: true },
  targetDate: { type: String, required: true },
  predictedPrice: { type: Number, required: true },
  bullish: { type: Number },
  bearish: { type: Number },
  predictedAt: { type: Date, default: Date.now },
});

forecastSchema.index({ symbol: 1, targetDate: 1 }, { unique: true });

export default mongoose.model("Forecast", forecastSchema);
