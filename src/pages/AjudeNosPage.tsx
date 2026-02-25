import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import VakinhaHeader from "../components/VakinhaHeader";

const AjudeNosPage = () => {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState("50");
  const [expanded, setExpanded] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
    navigate(`/pagamentos?valor=${amount.toFixed(2)}`);
  };

  const shortText =
    "AJUDE JOSÉ GERALDO (LORINHO) E MARIA DAS GRAÇAS (GRACINHA) A RECOMEÇAR – ENCHENTE EM UBÁ/MG";

  const fullText =
    "Meus avós, José Geraldo (conhecido como Lorinho) e Maria das Graças (Gracinha), foram gravemente afetados pela enchente que atingiu a cidade de Ubá. A água invadiu a casa e inundou tudo. Móveis, eletrodomésticos, roupas, alimentos e pertences pessoais foram perdidos. Eles ficaram apenas com a roupa do corpo.";

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
          src="https://static.vakinha.com.br/uploads/vakinha/image/5965638/1771932148.364.jpg?ims=700x410"
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
          AJUDE JOSÉ GERALDO (LORINHO) E MARIA DAS GRAÇAS (GRACINHA) A RECOMEÇAR – ENCHENTE EM UBÁ/MG
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
              background: "linear-gradient(135deg, #24ca68, #1aaa54)",
              color: "white",
              border: "none",
              borderRadius: 14,
              padding: "17px",
              fontSize: 17,
              fontWeight: 700,
              fontFamily: "DM Sans, sans-serif",
              cursor: "pointer",
              letterSpacing: "0.01em",
              boxShadow: "0 6px 20px rgba(36,202,104,0.35)",
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

        </div>

        {/* PIX + Story section */}
        <div style={{ marginTop: 28 }}>
          {/* Creation date */}
          <div style={{ fontSize: 14, color: "#374151", marginBottom: 16 }}>
            <strong>Vaquinha criada em:</strong> 24/02/2026
          </div>

          {/* Full story */}
          <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.75 }}>
            <p style={{ marginBottom: 12 }}>Meus avós, <strong>José Geraldo (conhecido como Lorinho) e Maria das Graças (Gracinha)</strong>, foram gravemente afetados pela enchente que atingiu a cidade de Ubá.</p>
            <p style={{ marginBottom: 12 }}>A água invadiu a casa e inundou tudo. Móveis, eletrodomésticos, roupas, alimentos e pertences pessoais foram perdidos. Eles ficaram apenas com a roupa do corpo.</p>
            <p style={{ marginBottom: 12 }}>Meu avô está em <strong>tratamento oncológico</strong> e precisa de medicação contínua. Minha avó é diagnosticada com <strong>Alzheimer e demência</strong>, também dependendo de remédios diários. No momento, eles estão sem as medicações e sem condições financeiras para repor o básico.</p>
            <p style={{ marginBottom: 12 }}>Graças a Deus, estão em segurança, acolhidos provisoriamente na casa de uma tia. Mas precisam urgentemente de ajuda para recomeçar — começando pelo essencial:</p>
            <ul style={{ paddingLeft: 20, marginBottom: 12 }}>
              <li>Compra das medicações</li>
              <li>Roupas</li>
              <li>Itens de higiene</li>
              <li>Alimentação</li>
              <li>Móveis e utensílios básicos</li>
            </ul>
            <p style={{ marginBottom: 12 }}>Qualquer valor faz diferença. Se você não puder contribuir financeiramente, pedimos que <strong>compartilhe esta vaquinha</strong> para que ela alcance mais pessoas.</p>
            <p style={{ marginBottom: 12 }}>Estamos buscando apoio para devolver dignidade, cuidado e esperança a quem sempre cuidou de toda a família.</p>
            <p style={{ marginBottom: 12 }}><strong>Doações físicas:</strong><br />Contato: 32 99856-3891 (Eduarda)<br />Endereço: Rua Ary Martins da Silva, nº 82, bairro Santo Antônio (ap 103) — Ubá/MG</p>
            <p style={{ marginBottom: 0 }}><strong>Que Deus abençoe cada gesto de solidariedade. 🙏</strong></p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div style={{ marginTop: 32 }}>
          <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 20 }}>
            Tudo o que você precisa saber sobre o Vakinha
          </div>
          {([
            {
              q: "Como ajudar Léia Ribeiro ?",
              a: (<>Fazendo uma doação diretamente pelo Vakinha.com.br.<br />Compartilhando a vaquinha nas suas redes sociais.<br />Divulgando para amigos e familiares que possam se sensibilizar com a causa.<br />Doando via PIX 5965893@vakinha.com.br.</>)
            },
            {
              q: "Quando a vaquinha foi criada?",
              a: "A vaquinha Minha mãe e irmã perderam tudo na enchente – precisamos de vocês foi criada em 24/02/2026."
            },
            {
              q: "Qual a meta da vaquinha Minha mãe e irmã perderam tudo na enchente – precisamos de vocês?",
              a: "Meta: R$ 50.000,00."
            },
            {
              q: "Como posso ajudar via chave PIX?",
              a: (<>Chave PIX: 5965893@vakinha.com.br.<br />Tipo de chave: E-mail.<br />Importante: Ao fazer uma doação via PIX, entre em contato com o criador da vaquinha para informar sobre a doação, assim podemos agradecer e manter o controle das contribuições.</>)
            },
            {
              q: "Quanto a vaquinha já arrecadou?",
              a: (<>Valor arrecadado: R$ 570,00.<br />Percentual da meta: 1%.<br />Número de doadores: 11.<br />Última atualização: 24/02/2026.</>)
            },
          ] as { q: string; a: React.ReactNode }[]).map((item, i) => (
            <div
              key={i}
              style={{ borderBottom: "1px solid #f0f0f0" }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{
                  width: "100%",
                  background: "none",
                  border: "none",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "DM Sans, sans-serif",
                }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: "#111827", paddingRight: 12 }}>{item.q}</span>
                <svg
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                  fill="#6b7280"
                  style={{ flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}
                >
                  <path d="M16.59 8.59 12 13.17 7.41 8.59 6 10l6 6 6-6z" />
                </svg>
              </button>
              {openFaq === i && (
                <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7, paddingBottom: 16 }}>
                  {item.a}
                </div>
              )}
            </div>
          ))}
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

      {/* Bottom buttons */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: "24px 20px 40px",
          boxSizing: "border-box",
        }}
      >
        <button
          onClick={handleDonate}
          style={{
            flex: 1,
            background: "linear-gradient(135deg, #24ca68, #1aaa54)",
            color: "white",
            border: "none",
            borderRadius: 12,
            padding: "14px",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "DM Sans, sans-serif",
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(36,202,104,0.3)",
          }}
        >
          Quero Ajudar
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: "Minha casa foi alagada", url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
              showToastMsg("🔗 Link copiado!");
            }
          }}
          style={{
            flex: 1,
            background: "white",
            color: "#374151",
            border: "1.5px solid #d1d5db",
            borderRadius: 12,
            padding: "14px",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "DM Sans, sans-serif",
            cursor: "pointer",
          }}
        >
          Compartilhar
        </button>
      </div>
    </div>
  );
};

export default AjudeNosPage;
