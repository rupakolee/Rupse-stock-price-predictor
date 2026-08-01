import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";
import Prediction from "../model/prediction.model.js";
import Forecast from "../model/forecast.model.js";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pythonExecutable = process.env.PYTHON_BIN || path.resolve(__dirname, "..", "..", ".venv", "bin", "python");
const predictScript = path.resolve(
  __dirname,
  "..",
  "..",
  "ml-model",
  "price-predictor",
  "src",
  "predict.py",
);

const clampHorizon = (value) => {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 5;
  return Math.min(Math.max(parsed, 1), 30);
};

const todayKey = (date = new Date()) => date.toISOString().split("T")[0];

const isPredictionFresh = (saved) => {
  if (!saved?.updatedAt) return false;
  return todayKey(new Date(saved.updatedAt)) === todayKey();
};

const saveForecasts = async (symbol, points, predictedAt = new Date()) => {
  const operations = (points || [])
    .filter((point) => point?.date && Number.isFinite(point.projected))
    .map((point) => ({
      updateOne: {
        filter: { symbol, targetDate: point.date },
        update: {
          $set: {
            symbol,
            targetDate: point.date,
            predictedPrice: point.projected,
            bullish: point.bullish,
            bearish: point.bearish,
            predictedAt,
          },
        },
        upsert: true,
      },
    }));

  if (operations.length) {
    await Forecast.bulkWrite(operations);
  }
};

const buildForecastSeries = async (symbol) => {
  const forecasts = await Forecast.find({ symbol }).sort({ targetDate: 1 }).lean();

  const performed = forecasts.filter(
    (forecast) =>
      forecast.predictedAt && todayKey(new Date(forecast.predictedAt)) <= forecast.targetDate,
  );

  return {
    predictedDates: performed.map((forecast) => forecast.targetDate),
    predictedPrices: performed.map((forecast) => forecast.predictedPrice),
  };
};

const buildBacktestSeries = (payload) => ({
  backtestDates: payload?.predictedDates ?? [],
  backtestPrices: payload?.predictedPrices ?? [],
});

const parsePredictionOutput = (stdout) => {
  const raw = stdout?.trim();
  if (!raw) {
    throw new Error("Prediction script returned no output");
  }

  const lines = raw.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    const line = lines[index];
    if (!line.startsWith("{")) continue;

    try {
      return JSON.parse(line);
    } catch {
      // Keep scanning upward in case a log line or partial JSON slipped in.
    }
  }

  throw new Error(raw);
};

export const fetchPrediction = async (req, res) => {
  const symbol = req.params?.symbol?.trim()?.toUpperCase();
  const horizon = clampHorizon(req.query?.horizon);
  const forceRefresh = req.query?.refresh === "1" || req.query?.refresh === "true";

  if (!symbol) {
    return res.status(400).json({
      success: false,
      message: "Symbol is required",
    });
  }

  const saved = await Prediction.findOne({ symbol, horizon });

  if (!forceRefresh && isPredictionFresh(saved)) {
    const series = await buildForecastSeries(symbol);
    return res.status(200).json({
      success: true,
      message: "Forecast served from saved predictions",
      data: {
        ...saved.payload,
        ...series,
        ...buildBacktestSeries(saved.payload),
        savedAt: saved.updatedAt,
        fromCache: true,
      },
      timestamp: new Date().toISOString(),
    });
  }

  try {
    const { stdout, stderr } = await execFileAsync(
      pythonExecutable,
      [predictScript, "--symbol", symbol, "--horizon", String(horizon)],
      {
        cwd: path.resolve(__dirname, "..", "..", "ml-model", "price-predictor"),
        maxBuffer: 10 * 1024 * 1024,
        env: {
          ...process.env,
          PYTHONUNBUFFERED: "1",
        },
      },
    );

    const data = parsePredictionOutput(stdout);

    const now = new Date();
    await saveForecasts(symbol, data.points, now);

    await Prediction.findOneAndUpdate(
      { symbol, horizon },
      { payload: data, updatedAt: now },
      { upsert: true, returnDocument: "after" },
    );

    const series = await buildForecastSeries(symbol);

    return res.status(200).json({
      success: true,
      message: "Forecast generated successfully",
      data: { ...data, ...series, ...buildBacktestSeries(data), savedAt: now, fromCache: false },
      timestamp: now.toISOString(),
    });
  } catch (error) {
    console.error("Prediction fetch error:", error);

    if (saved) {
      const series = await buildForecastSeries(symbol);
      return res.status(200).json({
        success: true,
        message: "Forecast recompute failed — returning last saved prediction",
        data: {
          ...saved.payload,
          ...series,
          ...buildBacktestSeries(saved.payload),
          savedAt: saved.updatedAt,
          fromCache: true,
        },
        timestamp: new Date().toISOString(),
      });
    }

    const message = error?.stderr?.toString?.().trim?.() || error?.message || "Failed to generate prediction";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
