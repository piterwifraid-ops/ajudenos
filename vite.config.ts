import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "node:http";

const BABYLON_SECRET_KEY = "sk_live_dqsFdUZ8AWn8m2vWxAgImUZQsXvDoEv8i94xoI7MwcyHykIX";
const BABYLON_COMPANY_ID = "52bef000-0bb0-42b2-a455-793dc0bd95f4";
const BABYLON_BASE = "https://api.bancobabylon.com/functions/v1";

const DUTTYFY_ENCRYPTED_URL = "https://www.pagamentos-seguros.app/api-pix/ERaU_NVyY-LvawtJWDIhBoWRqoRyKZ-1zxYpl_TclE8F26Wv_pm8dCLxpzXLrsz1Q89aTg2RUqVxYKVhwQsitg";

function babylonAuthHeader() {
  const credentials = Buffer.from(`${BABYLON_SECRET_KEY}:${BABYLON_COMPANY_ID}`).toString("base64");
  return `Basic ${credentials}`;
}

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", (c: Buffer) => (data += c.toString()));
    req.on("end", () => resolve(data));
    req.on("error", reject);
  });
}

async function localTransactionsHandler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // GET /api/invictus/transactions?id=<uuid> — poll status
  if (req.method === "GET") {
    try {
      const urlObj = new URL(req.url!, "http://localhost");
      const id = urlObj.searchParams.get("id");
      if (!id) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "id required" }));
        return;
      }
      const upstream = await fetch(`${BABYLON_BASE}/transactions/${id}`, {
        headers: {
          Authorization: babylonAuthHeader(),
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const data = await upstream.json();
      res.writeHead(upstream.status);
      res.end(JSON.stringify(data));
    } catch (err) {
      console.error("[local-api] GET error:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Erro ao consultar transação" }));
    }
    return;
  }

  // POST — create PIX transaction
  try {
    const raw = await readBody(req);
    const { amount, customer } = JSON.parse(raw);

    const txRes = await fetch(`${BABYLON_BASE}/transactions`, {
      method: "POST",
      headers: {
        Authorization: babylonAuthHeader(),
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        amount,
        paymentMethod: "PIX",
        customer: {
          name: customer.name,
          email: customer.email,
          phone: customer.phone,
          document: customer.document,
        },
        items: [
          {
            title: "Rifa Diego Faustino",
            unitPrice: amount,
            quantity: 1,
          },
        ],
        description: "Rifa Diego Faustino",
      }),
    });

    const txData = await txRes.json();
    res.writeHead(txRes.status);
    res.end(JSON.stringify(txData));
  } catch (err) {
    console.error("[local-api]", err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Erro interno ao gerar PIX" }));
  }
}

async function localDuttyfyHandler(req: IncomingMessage, res: ServerResponse) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /api/duttyfy/transactions?transactionId=<id> — poll status
  if (req.method === "GET") {
    try {
      const urlObj = new URL(req.url!, "http://localhost");
      const transactionId = urlObj.searchParams.get("transactionId");
      if (!transactionId) {
        res.writeHead(400);
        res.end(JSON.stringify({ error: "transactionId required" }));
        return;
      }
      const upstream = await fetch(`${DUTTYFY_ENCRYPTED_URL}?transactionId=${encodeURIComponent(transactionId)}`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await upstream.json();
      res.writeHead(upstream.status);
      res.end(JSON.stringify(data));
    } catch (err) {
      console.error("[duttyfy-api] GET error:", err);
      res.writeHead(500);
      res.end(JSON.stringify({ error: "Erro ao consultar transação" }));
    }
    return;
  }

  // POST — create PIX charge
  try {
    const raw = await readBody(req);
    const body = JSON.parse(raw);

    const upstream = await fetch(DUTTYFY_ENCRYPTED_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const txData = await upstream.json();
    console.log("[duttyfy-api] POST status:", upstream.status, JSON.stringify(txData));
    res.writeHead(upstream.status);
    res.end(JSON.stringify(txData));
  } catch (err) {
    console.error("[duttyfy-api] POST error:", err);
    res.writeHead(500);
    res.end(JSON.stringify({ error: "Erro interno ao gerar PIX", detail: String(err) }));
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8081,
    hmr: {
      overlay: false,
    },
  },
  plugins: [
    react(),
    mode === "development" && componentTagger(),
    {
      name: "local-invictus-api",
      configureServer(server) {
        server.middlewares.use("/api/invictus/transactions", (req, res, next) => {
          if (req.method === "POST" || req.method === "GET") {
            localTransactionsHandler(req, res);
          } else {
            next();
          }
        });
      },
    },
    {
      name: "local-duttyfy-api",
      configureServer(server) {
        server.middlewares.use("/api/duttyfy/transactions", (req, res, next) => {
          if (req.method === "POST" || req.method === "GET" || req.method === "OPTIONS") {
            localDuttyfyHandler(req, res);
          } else {
            next();
          }
        });
      },
    },
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
