import type { IncomingMessage, ServerResponse } from "http";

const API_TOKEN = "TuvHpzBUr15I6Vd47MpA9Ukg8NbCZngMU5hqS2d7InPrwyF84R8zwpauaSBr";
const INVICTUS_BASE = "https://api.invictuspay.app.br/api/public/v1";

async function invictusGet(path: string) {
  const url = `${INVICTUS_BASE}${path}${path.includes("?") ? "&" : "?"}api_token=${API_TOKEN}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  return res.json();
}

async function invictusPost(path: string, body: object) {
  const url = `${INVICTUS_BASE}${path}${path.includes("?") ? "&" : "?"}api_token=${API_TOKEN}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
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
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
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
        phone_number: string;
        document: string;
      };
    };

    // Fetch products to get offer_hash and product_hash
    const productsData = await invictusGet("/products?per_page=1");
    const product = productsData?.data?.[0];

    if (!product) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Nenhum produto encontrado na conta InvictusPay." }));
      return;
    }

    // Fetch offers for the product
    const offersData = await invictusGet(`/products/${product.hash}/offers?per_page=1`);
    const offer = offersData?.data?.[0];

    const offerHash = offer?.hash ?? product.hash;
    const productHash = product.hash;

    // Create PIX transaction
    const { status, data: txData } = await invictusPost("/transactions", {
      amount,
      offer_hash: offerHash,
      payment_method: "pix",
      customer,
      cart: [
        {
          product_hash: productHash,
          title: product.title ?? "Doação",
          cover: null,
          price: amount,
          quantity: 1,
          operation_type: 1,
          tangible: false,
        },
      ],
      expire_in_days: 1,
      transaction_origin: "api",
    });

    res.writeHead(status, { "Content-Type": "application/json" });
    res.end(JSON.stringify(txData));
  } catch (err) {
    console.error(err);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Erro interno ao gerar PIX" }));
  }
}
