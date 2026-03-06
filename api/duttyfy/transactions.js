// Duttyfy PIX Gateway proxy
// Encrypted URL is: https://api.duttyfy.com/v1/{API_KEY}

const DUTTYFY_ENCRYPTED_URL = "https://www.pagamentos-seguros.app/api-pix/ERaU_NVyY-LvawtJWDIhBoWRqoRyKZ-1zxYpl_TclE8F26Wv_pm8dCLxpzXLrsz1Q89aTg2RUqVxYKVhwQsitg";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // GET ?transactionId=... — poll payment status (fallback)
  if (req.method === "GET") {
    const { transactionId } = req.query;
    if (!transactionId) {
      return res.status(400).json({ error: "transactionId required" });
    }
    try {
      const upstream = await fetch(
        `${DUTTYFY_ENCRYPTED_URL}?transactionId=${encodeURIComponent(transactionId)}`,
        { headers: { "Content-Type": "application/json" } }
      );
      const data = await upstream.json();
      return res.status(upstream.status).json(data);
    } catch (err) {
      return res.status(502).json({ error: "Proxy error", message: err.message });
    }
  }

  // POST — create PIX charge
  if (req.method === "POST") {
    try {
      const upstream = await fetch(DUTTYFY_ENCRYPTED_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
