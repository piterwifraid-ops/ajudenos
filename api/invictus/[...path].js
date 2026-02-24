export default async function handler(req, res) {
  // CORS headers on every response
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");

  // Handle preflight
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  const { path = [] } = req.query;
  const pathStr = Array.isArray(path) ? path.join("/") : path;

  const query = { ...req.query };
  delete query.path;
  const queryString = new URLSearchParams(query).toString();

  const targetUrl = `https://api.invictuspay.app.br/api/public/v1/${pathStr}${queryString ? "?" + queryString : ""}`;

  const fetchOptions = {
    method: req.method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    fetchOptions.body = JSON.stringify(req.body);
  }

  try {
    const upstream = await fetch(targetUrl, fetchOptions);
    const text = await upstream.text();
    res.status(upstream.status);
    res.setHeader("Content-Type", "application/json");
    res.send(text);
  } catch (err) {
    res.status(502).json({ error: "Proxy error", message: err.message });
  }
}
