import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import flightsRouter from "./routes/flights.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend assets
app.use(express.static(path.join(__dirname, "../frontend")));

// Health route
app.get("/api/health", (req, res) => res.json({ ok: true, status: "running" }));

// Flights API
app.use("/api/flights", flightsRouter);

// ✅ Express 5-compatible fallback
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`✅ Unified app running at http://localhost:${PORT}`);
  console.log("🌍 Serving frontend from ../frontend");
  console.log("📡 Routes: /api/health, /api/flights/search");
  console.log("🔐 Env key loaded:", !!process.env.AVIATIONSTACK_KEY);
});
