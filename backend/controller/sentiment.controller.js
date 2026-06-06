import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";
import { fileURLToPath } from "url";

const execFileAsync = promisify(execFile);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const pythonExecutable =
    process.env.PYTHON_BIN ||
    path.resolve(__dirname, "..", "..", ".venv", "bin", "python");

const scriptPath = path.resolve(
    __dirname,
    "..",
    "..",
    "ml-model",
    "sentiment",
    "sentiment_news.py"
);

const parseOutput = (stdout) => {
    const raw = stdout?.trim();
    if (!raw) throw new Error("Script returned no output");

    const lines = raw.split(/\r?\n/).filter(Boolean);
    for (let i = lines.length - 1; i >= 0; i--) {
        if (!lines[i].startsWith("{")) continue;
        try {
            return JSON.parse(lines[i]);
        } catch {
            // keep scanning
        }
    }
    throw new Error(raw);
};

export const fetchSentiment = async (req, res) => {
    const symbol = req.params?.symbol?.trim()?.toUpperCase();

    if (!symbol) {
        return res.status(400).json({ success: false, message: "Symbol is required" });
    }

    try {
        const { stdout } = await execFileAsync(
            pythonExecutable,
            [scriptPath, "--symbol", symbol, "--mode", "sentiment"],
            {
                maxBuffer: 5 * 1024 * 1024,
                env: { ...process.env, PYTHONUNBUFFERED: "1" },
            }
        );

        const data = parseOutput(stdout);

        if (data.error) {
            return res.status(404).json({ success: false, message: data.error });
        }

        return res.status(200).json({
            success: true,
            message: "Sentiment data fetched successfully",
            data,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error("Sentiment fetch error:", error);
        return res.status(500).json({
            success: false,
            message: error?.message || "Failed to fetch sentiment data",
        });
    }
};
