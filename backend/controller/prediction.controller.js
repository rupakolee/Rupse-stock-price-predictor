import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

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

  if (!symbol) {
    return res.status(400).json({
      success: false,
      message: "Symbol is required",
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

    return res.status(200).json({
      success: true,
      message: "Forecast generated successfully",
      data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Prediction fetch error:", error);

    const message = error?.stderr?.toString?.().trim?.() || error?.message || "Failed to generate prediction";

    return res.status(500).json({
      success: false,
      message,
    });
  }
};
