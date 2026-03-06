// Blackcat Pay API proxy
// POST  → creates a PIX sale via POST /sales/create-sale
// GET   → polls transaction status via GET /sales/{id}/status

const BLACKCAT_BASE = "https://api.blackcatpay.com.br/api";
const API_KEY = "sk_live_c349db83471321a9c6bafd5f8072a52cfdd90e4bd753b742de9072951fa15001";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // GET ?id=<transactionId> — poll payment status
  if (req.method === "GET") {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({ error: "id required" });
    }
    try {
      const upstream = await fetch(`${BLACKCAT_BASE}/sales/${encodeURIComponent(id)}/status`, {
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
      });
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    } catch (err) {
      return res.status(502).json({ error: "Proxy error", message: err.message });
    }
  }

  // POST — create PIX sale
  if (req.method === "POST") {
    try {
      const upstream = await fetch(`${BLACKCAT_BASE}/sales/create-sale`, {
        method: "POST",
        headers: {
          "X-API-Key": API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(req.body),
      });
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    } catch (err) {
      return res.status(502).json({ error: "Proxy error", message: err.message });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
