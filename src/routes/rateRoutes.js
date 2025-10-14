const express = require("express");

const router = express.Router();

let cachedRates = null;
let lastFetched = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30 دقیقه
const API_KEY = process.env.CURRENCYFREAKS_KEY;

router.get("/", async (req, res) => {
  try {
    const base = req.query.base || "USD";
    const target = req.query.target || "IRR";
    const now = Date.now();

    // استفاده از کش
    if (cachedRates && lastFetched && now - lastFetched < CACHE_DURATION) {
      const rateBase = cachedRates[base];
      const rateTarget = cachedRates[target];

      if (rateBase && rateTarget) {
        const rate = rateTarget / rateBase;
        return res.json({
          success: true,
          source: "cache",
          base,
          target,
          rate,
          lastUpdated: new Date(lastFetched).toISOString(),
        });
      }
    }

    // درخواست به API خارجی
    const apiUrl = `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${API_KEY}`;
    const response = await fetch(apiUrl);

    if (!response.ok) throw new Error(`API error: ${response.statusText}`);

    const data = await response.json();
    cachedRates = data.rates;
    lastFetched = now;

    const rateBase = cachedRates[base];
    const rateTarget = cachedRates[target];

    if (!rateBase || !rateTarget) {
      return res.status(404).json({ success: false, message: `Base or target not found.` });
    }

    const rate = rateTarget / rateBase;

    res.json({
      success: true,
      source: "api",
      base,
      target,
      rate,
      lastUpdated: new Date(now).toISOString(),
    });

  } catch (err) {
    console.error("Error fetching currency rates:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
