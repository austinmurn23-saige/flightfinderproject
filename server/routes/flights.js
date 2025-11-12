import express from "express";
import axios from "axios";
const router = express.Router();

router.get("/search", async (req, res) => {
  try {
    const { origin = "JFK", destination = "LAX" } = req.query;
    const response = await axios.get("http://api.aviationstack.com/v1/flights", {
      params: {
        access_key: process.env.AVIATIONSTACK_KEY,
        dep_iata: origin,
        arr_iata: destination,
        limit: 5,
      },
    });

    const flights = response.data.data || [];
    if (!flights.length) return res.status(404).json({ message: "No flights found" });

    const best = flights[0];
    const backups = flights.slice(1, 4);
    res.json({ best, backups });
  } catch (error) {
    console.error("[ERR] Flight fetch failed:", error.message);
    res.status(500).json({ error: "Failed to fetch flight data" });
  }
});

export default router;
