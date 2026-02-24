import React, { useState } from "react";
import VakinhaHeader from "../components/VakinhaHeader";

const AjudeNosPage = () => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("50");
  const [expanded, setExpanded] = useState(false);
  const [toast, setToast] = useState("");
  const [showToast, setShowToast] = useState(false);

  const collected = 570;
  const goal = 50000;
  const donors = 134;
  const daysLeft = 32;
  const percent = Math.round((collected / goal) * 100);

  const showToastMsg = (msg: string) => {
    setToast(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const getChosenAmount = () => {
    const v = parseFloat(customAmount);
    return v > 0 ? v : selectedAmount;
  };

  const handleDonate = () => {
    const amount = getChosenAmount();
    if (!amount) {
      showToastMsg("⚠️ Escolha ou digite um valor");
      return;
    }
    alert(
      `Obrigado(a) por querer ajudar com R$ ${amount
        .toFixed(2)
        .replace(".", ",")}! Use a chave Pix abaixo para concluir sua doação. 💚`
    );
  };

  const shortText =
    "Amigos, familiares e todos aqueles que têm um coração solidário. Venho hoje pedir ajuda em um momento de extrema dor e necessidade. Uma forte chuva alagou minha casa completamente e não sobrou nada...";

  const fullText =
    "Amigos, familiares e todos aqueles que têm um coração solidário. Venho hoje pedir ajuda em um momento de extrema dor e necessidade. Uma forte chuva alagou minha casa completamente. Móveis, eletrodomésticos, documentos e todas as minhas lembranças foram levados pela água e pelo barro. Não sobrou nada. É difícil descrever a sensação de ver tudo que você construiu desaparecer em questão de horas. Estou sem saber por onde começar, sem forças diante de tamanha tragédia. Cada contribuição, por menor que seja, vai me ajudar a reconstruir o essencial e recuperar a dignidade de ter um lar. Por favor, me ajudem a recomeçar. 🙏";

  const amounts = [10, 25, 50, 100];

  return (
    <div
      style={{
        fontFamily: "DM Sans, sans-serif",
        background: "#fff",
        minHeight: "100vh",
        color: "#1a1a2e",
        maxWidth: 480,
        margin: "0 auto",
      }}
    >
      <VakinhaHeader />

      {/* Photo area */}
      <div style={{ position: "relative" }}>
        <img
          src="https://static.vakinha.com.br/uploads/vakinha/image/5965893/1771940560.014.jpg?ims=700x410"
          alt="Foto da enchente"
          style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
        />
        {/* Bookmark button */}
        <button
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            background: "white",
            border: "none",
            borderRadius: "50%",
            width: 38,
            height: 38,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9b7ecb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div style={{ padding: "18px 20px 40px" }}>
        {/* Category */}
        <div
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: "0.12em",
            color: "#6b7280",
            textTransform: "uppercase",
            marginBottom: 10,
          }}
        >
          Tragédias / Desastres / Acidentes
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize: 22,
            fontWeight: 700,
            lineHeight: 1.3,
            marginBottom: 6,
            color: "#111827",
          }}
        >
          Minha casa foi completamente alagada — preciso de ajuda para recomeçar
        </h1>

        {/* ID */}
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 12 }}>
          ID: 5965893
        </div>

        {/* Description */}
        <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.65, marginBottom: 20 }}>
          {expanded ? fullText : shortText}
          {!expanded && (
            <span
              style={{ color: "#0077b6", cursor: "pointer", fontWeight: 600, marginLeft: 4 }}
              onClick={() => setExpanded(true)}
            >
              ver tudo
            </span>
          )}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 20 }} />

        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
            <span
              style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 26,
                fontWeight: 700,
                color: "#1db870",
              }}
            >
              R$ {collected.toLocaleString("pt-BR", { minimumFractionDigits: 3 }).replace(",", ".")}
            </span>
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              Meta: R$ {goal.toLocaleString("pt-BR", { minimumFractionDigits: 3 }).replace(",", ".")}
            </span>
          </div>
          {/* Bar */}
          <div
            style={{
              height: 8,
              background: "#e5e7eb",
              borderRadius: 8,
              overflow: "hidden",
              marginBottom: 10,
            }}
          >
            <div
              style={{
                height: "100%",
                width: `${percent}%`,
                background: "linear-gradient(90deg, #1db870, #0e9d5a)",
                borderRadius: 8,
              }}
            />
          </div>
          <div style={{ display: "flex", gap: 20, fontSize: 13, color: "#6b7280" }}>
            <span>
              <strong style={{ color: "#111827" }}>{donors}</strong> doadores
            </span>
            <span>
              <strong style={{ color: "#111827" }}>{daysLeft}</strong> dias restantes
            </span>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#f0f0f0", marginBottom: 20 }} />

        {/* Donation section */}
        <div>
          <p style={{ fontSize: 13, color: "#374151", fontWeight: 500, marginBottom: 14 }}>
            Escolha ou insira o valor da sua doação:
          </p>

          {/* Amount chips */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
            {amounts.map((value) => {
              const active = selectedAmount === value;
              return (
                <button
                  key={value}
                  onClick={() => {
                    setSelectedAmount(value);
                    setCustomAmount(String(value));
                  }}
                  style={{
                    padding: "9px 20px",
                    borderRadius: 50,
                    border: `2px solid ${active ? "#1db870" : "#d1d5db"}`,
                    background: active ? "#1db870" : "white",
                    color: active ? "white" : "#374151",
                    fontSize: 14,
                    fontWeight: 600,
                    fontFamily: "DM Sans, sans-serif",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                >
                  R$ {value}
                </button>
              );
            })}
          </div>

          {/* Custom input */}
          <div
            style={{
              border: "1.5px solid #d1d5db",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              padding: "12px 16px",
              marginBottom: 16,
              background: "#fafafa",
            }}
          >
            <span style={{ color: "#9ca3af", fontSize: 15, marginRight: 6 }}>R$</span>
            <input
              type="number"
              min={1}
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
                setSelectedAmount(null);
              }}
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 16,
                fontFamily: "DM Sans, sans-serif",
                color: "#111827",
                width: "100%",
              }}
              placeholder="0"
            />
          </div>

          {/* Donate button */}
          <button
            onClick={handleDonate}
            style={{
              width: "100%",
              background: "linear-gradient(135deg, #f97316, #ea580c)",
              color: "white",
              border: "none",
              borderRadius: 14,
              padding: "17px",
              fontSize: 17,
              fontWeight: 700,
              fontFamily: "DM Sans, sans-serif",
              cursor: "pointer",
              letterSpacing: "0.01em",
              boxShadow: "0 6px 20px rgba(234,88,12,0.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="0">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
            Quero ajudar agora
          </button>

          {/* Security notice */}
          <div
            style={{
              textAlign: "center",
              marginTop: 12,
              fontSize: 12,
              color: "#9ca3af",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 5,
            }}
          >
            <span>🔒</span>
            <span>Doação 100% segura e protegida</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      <div
        style={{
          position: "fixed",
          bottom: 30,
          left: "50%",
          transform: showToast
            ? "translateX(-50%) translateY(0)"
            : "translateX(-50%) translateY(100px)",
          background: "#1a1a2e",
          color: "white",
          padding: "12px 24px",
          borderRadius: 50,
          fontSize: 14,
          fontWeight: 500,
          zIndex: 1000,
          transition: "transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)",
          whiteSpace: "nowrap",
        }}
      >
        {toast}
      </div>
    </div>
  );
};

export default AjudeNosPage;
