import mongoose from "mongoose";

const stockDataSchema = new mongoose.Schema({
  ticker: { type: String, required: true, unique: true, uppercase: true },
  raw: {type: mongoose.Schema.Types.Mixed, required: true},
  updatedAt: {type:Date, default: Date.now}
});


export default mongoose.model("StockData", stockDataSchema);