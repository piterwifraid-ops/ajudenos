import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import VakinhaHeader from "../components/VakinhaHeader";

/* ── InvictusPay config ── */
const API_BASE     = "/api/invictus/transactions";
const API_TOKEN    = "TuvHpzBUr15I6Vd47MpA9Ukg8NbCZngMU5hqS2d7InPrwyF84R8zwpauaSBr";
const OFFER_HASH   = "y6smn";
const PRODUCT_HASH = "zehyvhvs6j";
const PIX_KEY      = "5965893@vakinha.com.br";

/* ── Icons ── */
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
  </svg>
);

/* ── Generate a valid CPF ── */
function generateCPF(): string {
  const n = Array.from({ length: 9 }, () => Math.floor(Math.random() * 10));
  const d1 = 11 - (n.reduce((s, v, i) => s + v * (10 - i), 0) % 11);
  const c1 = d1 >= 10 ? 0 : d1;
  const n2 = [...n, c1];
  const d2 = 11 - (n2.reduce((s, v, i) => s + v * (11 - i), 0) % 11);
  const c2 = d2 >= 10 ? 0 : d2;
  return [...n, c1, c2].join("");
}

/* ── Page ── */
const PagamentosPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const valor = parseFloat(searchParams.get("valor") || "50");
  const amountCents = Math.round(valor * 100);
  const valorFormatado = valor.toFixed(2).replace(".", ",");

  const [pixCode, setPixCode]           = useState("");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState("");
  const [copiedCode, setCopiedCode]     = useState(false);
  const [copiedKey, setCopiedKey]       = useState(false);
  const [paymentStatus, setPaymentStatus] = useState("pending");

  const pollingRef  = useRef<number | null>(null);
  const creatingRef = useRef(false);

  /* ── Create transaction ── */
  const createTransaction = useCallback(async () => {
    if (creatingRef.current) return;
    creatingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const names    = ["Carlos","Ana","Lucas","Mariana","Pedro","Julia","Rafael","Fernanda","Bruno","Camila"];
      const surnames = ["Silva","Santos","Oliveira","Souza","Lima","Costa","Ferreira","Alves","Pereira","Gomes"];
      const ddds     = ["11","21","31","41","51","61","71","81","85","91"];
      const firstName = names[Math.floor(Math.random() * names.length)];
      const lastName  = surnames[Math.floor(Math.random() * surnames.length)];
      const ddd       = ddds[Math.floor(Math.random() * ddds.length)];
      const cpf       = generateCPF();
      const phone     = ddd + "9" + String(Math.floor(10000000 + Math.random() * 89999999)); // 11 digits
      const emailSlug = (firstName + lastName + Math.floor(Math.random() * 9999)).toLowerCase();

      const streets  = ["Rua das Flores","Av. Paulista","Rua da Liberdade","Rua XV de Novembro","Av. Brasil"];
      const cities    = [{city:"São Paulo",state:"SP",zip:"01310100"},{city:"Rio de Janeiro",state:"RJ",zip:"20040020"},{city:"Belo Horizonte",state:"MG",zip:"30130010"},{city:"Curitiba",state:"PR",zip:"80010010"},{city:"Salvador",state:"BA",zip:"40020280"}];
      const place = cities[Math.floor(Math.random() * cities.length)];
      const street = streets[Math.floor(Math.random() * streets.length)];
      const houseNum = String(Math.floor(1 + Math.random() * 999));

      const body = {
        amount: amountCents,
        offer_hash: OFFER_HASH,
        payment_method: "pix",
        customer: {
          name: `${firstName} ${lastName}`,
          email: `${emailSlug}@gmail.com`,
          phone_number: phone,
          document: cpf,
          street_name: street,
          number: houseNum,
          complement: "",
          neighborhood: "Centro",
          city: place.city,
          state: place.state,
          zip_code: place.zip,
        },
        cart: [
          {
            product_hash: PRODUCT_HASH,
            title: "Doacao",
            cover: null,
            price: amountCents,
            quantity: 1,
            operation_type: 1,
            tangible: false,
          },
        ],
        expire_in_days: 1,
        transaction_origin: "api",
      };

      console.log("[InvictusPay] POST body:", JSON.stringify(body));

      const res  = await fetch(`${API_BASE}?api_token=${API_TOKEN}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      });

      const rawText = await res.text();
      console.log("[InvictusPay] Response status:", res.status, "body:", rawText);
      let json: Record<string, unknown> = {};
      try { json = rawText ? JSON.parse(rawText) : {}; } catch { /* non-JSON body */ }

      if (!res.ok) {
        const msg = (json as Record<string, unknown>)?.message as string
          || (json as Record<string, unknown>)?.error as string
          || rawText
          || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      const tx     = (json.data as Record<string, unknown>) || json as Record<string, unknown>;
      const pix    = tx?.pix as Record<string, unknown> | undefined;
      const qrCode = (pix?.pix_qr_code || pix?.qrcode || tx?.pix_qrcode || tx?.qrcode || "") as string;
      const txHash = String(tx?.hash || tx?.id || "");
      const status = (tx?.payment_status || tx?.status || "pending") as string;

      if (!qrCode) throw new Error("QR code não retornado pela API.");

      setPixCode(qrCode);
      setTransactionId(txHash);
      if (status === "paid") setPaymentStatus("paid");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar pagamento.");
    } finally {
      setLoading(false);
      creatingRef.current = false;
    }
  }, [amountCents]);

  /* ── Poll payment status ── */
  const checkStatus = useCallback(async (hash: string) => {
    try {
      const res  = await fetch(`${API_BASE}/${hash}?api_token=${API_TOKEN}`, {
        headers: { "Content-Type": "application/json", Accept: "application/json" },
      });
      if (!res.ok) return;
      const rawText = await res.text();
      let json: Record<string, unknown> = {};
      try { json = rawText ? JSON.parse(rawText) : {}; } catch { return; }
      const tx   = (json.data as Record<string, unknown>) || json;
      const s    = (tx?.payment_status || tx?.status) as string | undefined;
      if (s) setPaymentStatus(s);
      if (s === "paid" && pollingRef.current) {
        window.clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    } catch { /* ignore */ }
  }, []);

  /* ── Effects ── */
  useEffect(() => { createTransaction(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!transactionId || paymentStatus === "paid") return;
    checkStatus(transactionId);
    pollingRef.current = window.setInterval(() => checkStatus(transactionId), 5000);
    return () => {
      if (pollingRef.current) { window.clearInterval(pollingRef.current); pollingRef.current = null; }
    };
  }, [transactionId, paymentStatus, checkStatus]);

  /* ── Copy helper ── */
  const copyToClipboard = (text: string, which: "code" | "key") => {
    navigator.clipboard.writeText(text).catch(() => {
      const el = document.createElement("textarea");
      el.value = text;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    });
    if (which === "code") { setCopiedCode(true); setTimeout(() => setCopiedCode(false), 2000); }
    else                  { setCopiedKey(true);  setTimeout(() => setCopiedKey(false),  2000); }
  };

  /* ── Styles ── */
  const containerStyle: React.CSSProperties = {
    maxWidth: 480,
    margin: "0 auto",
    fontFamily: "'DM Sans', sans-serif",
    background: "#f5f5f5",
    minHeight: "100vh",
  };

  const cardStyle: React.CSSProperties = {
    background: "#fff",
    marginBottom: 8,
    padding: "20px 18px",
  };

  const inputRowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    border: "1px solid #d1d5db",
    borderRadius: 8,
    overflow: "hidden",
    background: "#f9fafb",
    marginTop: 10,
  };

  const inputStyle: React.CSSProperties = {
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
  };

  const copyBtnStyle: React.CSSProperties = {
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "10px 12px",
    display: "flex",
    alignItems: "center",
    transition: "color 0.2s",
  };

  /* ── Paid screen ── */
  if (paymentStatus === "paid") {
    return (
      <div style={containerStyle}>
        <VakinhaHeader />
        <div style={{
          ...cardStyle,
          textAlign: "center",
          padding: "60px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "60vh",
          gap: 16,
        }}>
          <div style={{ fontSize: 56 }}>💚</div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#111827", margin: 0 }}>
            Pagamento confirmado!
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

  return (
    <div style={containerStyle}>
      <VakinhaHeader />

      {/* Title */}
      <div style={{ background: "#fff", padding: "24px 18px 20px", marginBottom: 8, textAlign: "center" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#111827", lineHeight: 1.35, margin: 0 }}>
          Efetue o pagamento para{" "}
          <span style={{ display: "block" }}>confirmar a contribuição</span>
        </h1>
        <p style={{ margin: "8px 0 0", fontSize: 15, color: "#24ca68", fontWeight: 700 }}>
          R$ {valorFormatado}
        </p>
      </div>

      {/* ── Loading ── */}
      {loading && (
        <div style={{ ...cardStyle, textAlign: "center", padding: "48px 18px" }}>
          <div style={{
            width: 48, height: 48,
            border: "4px solid #e5e7eb",
            borderTop: "4px solid #24ca68",
            borderRadius: "50%",
            margin: "0 auto 16px",
            animation: "spin 0.8s linear infinite",
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#374151", fontWeight: 600, margin: "0 0 4px" }}>Gerando pagamento PIX...</p>
          <p style={{ color: "#9ca3af", fontSize: 13, margin: 0 }}>Aguarde alguns segundos</p>
        </div>
      )}

      {/* ── Error ── */}
      {!loading && error && (
        <div style={{ ...cardStyle, textAlign: "center", padding: "40px 18px" }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
          <p style={{ fontWeight: 700, color: "#111827", margin: "0 0 8px" }}>Falha ao gerar pagamento</p>
          <p style={{ color: "#6b7280", fontSize: 13, margin: "0 0 20px" }}>{error}</p>
          <button
            onClick={() => { creatingRef.current = false; createTransaction(); }}
            style={{
              padding: "10px 24px",
              background: "linear-gradient(135deg, #24ca68, #1aaa54)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Tentar novamente
          </button>
        </div>
      )}

      {/* ── PIX content ── */}
      {!loading && !error && pixCode && (
        <>
          {/* Awaiting badge */}
          <div style={{
            background: "#fff", marginBottom: 8, padding: "12px 18px",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <span style={{
              display: "inline-block", width: 10, height: 10, borderRadius: "50%",
              background: "#f59e0b", boxShadow: "0 0 0 3px #fde68a",
              animation: "pulse 1.5s ease-in-out infinite",
            }} />
            <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.5} }`}</style>
            <span style={{ fontSize: 13, color: "#92400e", fontWeight: 600 }}>
              Aguardando pagamento...
            </span>
          </div>

          {/* QR Code */}
          <div style={{ ...cardStyle, textAlign: "center" }}>
            <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 14px", color: "#111827" }}>
              Escaneie o QR Code com seu banco
            </p>
            <div style={{
              display: "inline-flex", padding: 12,
              background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12,
            }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(pixCode)}`}
                alt="QR Code PIX"
                width={240}
                height={240}
                style={{ display: "block" }}
              />
            </div>
          </div>

          {/* PIX Copia e Cola */}
          <div style={cardStyle}>
            <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 4px", color: "#111827" }}>
              Pix Copia e Cola
            </p>
            <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 2px" }}>
              <strong>Clique no botão</strong> para <strong>copiar o código</strong> e pague via{" "}
              <strong>Pix Copia e Cola</strong> no seu banco.
            </p>
            <div style={inputRowStyle}>
              <input readOnly style={inputStyle} value={pixCode} />
              <button
                style={{ ...copyBtnStyle, color: copiedCode ? "#24ca68" : "#6b7280" }}
                onClick={() => copyToClipboard(pixCode, "code")}
              >
                {copiedCode ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>

            <div style={{ textAlign: "center", marginTop: 20 }}>
              <button
                onClick={() => setPaymentStatus("paid")}
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
          </div>

          {/* PIX key fallback */}
          <div style={cardStyle}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#111827", margin: "0 0 4px", textTransform: "uppercase" }}>
              Não conseguiu usar o código? <strong>Doe usando a chave PIX!</strong>
            </p>
            <p style={{ fontSize: 13, color: "#374151", margin: "0 0 4px" }}>
              <strong>Copie a chave PIX exclusiva</strong> da vaquinha e transfira o valor via PIX,
              usando o aplicativo do seu banco.
            </p>
            <div style={inputRowStyle}>
              <input readOnly style={inputStyle} value={PIX_KEY} />
              <button
                style={{ ...copyBtnStyle, color: copiedKey ? "#24ca68" : "#6b7280" }}
                onClick={() => copyToClipboard(PIX_KEY, "key")}
              >
                {copiedKey ? <CheckIcon /> : <CopyIcon />}
              </button>
            </div>
          </div>

          {/* How-to steps */}
          <div style={cardStyle}>
            <p style={{ fontWeight: 700, fontSize: 14, margin: "0 0 14px", color: "#111827" }}>
              Como pagar com QR Code
            </p>
            {[
              "Abra seu aplicativo bancário",
              'Acesse a área PIX e escolha "Ler QR Code"',
              "Escaneie o QR Code acima",
              "Confirme as informações e finalize",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: i < 3 ? 10 : 0 }}>
                <span style={{
                  minWidth: 26, height: 26, borderRadius: "50%",
                  background: "#24ca68", color: "#fff",
                  fontWeight: 700, fontSize: 13,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {i + 1}
                </span>
                <span style={{ fontSize: 13, color: "#374151" }}>{step}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Back link */}
      <div style={{ textAlign: "center", padding: "20px 0 40px" }}>
        <button
          onClick={() => navigate("/ajudenos")}
          style={{
            background: "none", border: "none",
            color: "#6b7280", fontSize: 14,
            cursor: "pointer", textDecoration: "underline",
          }}
        >
          ← Voltar para a vaquinha
        </button>
      </div>
    </div>
  );
};

export default PagamentosPage;
