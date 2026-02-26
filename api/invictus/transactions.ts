import type { IncomingMessage, ServerResponse } from "http";

const SECRET_KEY = "sk_live_dqsFdUZ8AWn8m2vWxAgImUZQsXvDoEv8i94xoI7MwcyHykIX";
const COMPANY_ID = "52bef000-0bb0-42b2-a455-793dc0bd95f4";
const BABYLON_BASE = "https://api.bancobabylon.com/functions/v1";

function authHeader() {
  const credentials = Buffer.from(`${SECRET_KEY}:${COMPANY_ID}`).toString("base64");
  return `Basic ${credentials}`;
}

async function babylonGet(path: string) {
  const url = `${BABYLON_BASE}${path}`;
  const res = await fetch(url, {
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
  return res.json();
}

async function babylonPost(path: string, body: object) {
  const url = `${BABYLON_BASE}${path}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: authHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return { status: res.status, data };
}

async function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => resolve(body));
    req.on("error", reject);
  });
}

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  // CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // GET /api/invictus/transactions?id=<uuid> — poll transaction status
  if (req.method === "GET") {
    const urlObj = new URL(req.url!, `http://localhost`);
    const id = urlObj.searchParams.get("id");
    if (!id) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "id required" }));
      return;
    }
    const data = await babylonGet(`/transactions/${id}`);
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(data));
    return;
  }

  if (req.method !== "POST") {
    res.writeHead(405, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Method not allowed" }));
    return;
  }

  try {
    const raw = await readBody(req);
    const { amount, customer } = JSON.parse(raw) as {
      amount: number;
      customer: {
        name: string;
        email: string;
        phone: string;
        document: string;
      };
    };

    // Create PIX transaction via Banco BABYLON
    const { status, data: txData } = await babylonPost("/transactions", {
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
    });

    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(txData));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Erro interno ao gerar PIX" }));
  }
}
