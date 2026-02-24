import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import type { IncomingMessage, ServerResponse } from "node:http";

const INVICTUS_API_TOKEN = "TuvHpzBUr15I6Vd47MpA9Ukg8NbCZngMU5hqS2d7InPrwyF84R8zwpauaSBr";
const INVICTUS_BASE = "https://api.invictuspay.app.br/api/public/v1";

function invictusUrl(path: string) {
  const sep = path.includes("?") ? "&" : "?";
  return `${INVICTUS_BASE}${path}${sep}api_token=${INVICTUS_API_TOKEN}`;
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
  try {
    const raw = await readBody(req);
    const { amount, customer } = JSON.parse(raw);

    const productsRes = await fetch(invictusUrl("/products?per_page=1"), {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    const productsData = await productsRes.json();
    const product = productsData?.data?.[0];
    if (!product) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Nenhum produto encontrado na conta InvictusPay." }));
      return;
    }

    const offersRes = await fetch(invictusUrl(`/products/${product.hash}/offers?per_page=1`), {
      headers: { "Content-Type": "application/json", Accept: "application/json" },
    });
    const offersData = await offersRes.json();
    const offer = offersData?.data?.[0];
    const offerHash = offer?.hash ?? product.hash;

    const txRes = await fetch(invictusUrl("/transactions"), {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        amount,
        offer_hash: offerHash,
        payment_method: "pix",
        customer,
        cart: [
          {
            product_hash: product.hash,
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
          if (req.method === "POST") {
            localTransactionsHandler(req, res);
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
