import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import VakinhaHeader from "../components/VakinhaHeader";

const css = `
  :root {
    --cor-primaria: #24ca68;
    --cor-secundaria: #009d4e;
    --bg-primario: #ffffff;
    --bg-secundario: #f9f9f9;
    --cor-texto: #282828;
    --cor-texto-gray: #8a8a8a;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: "Montserrat", sans-serif;
    background: var(--bg-secundario);
    color: var(--cor-texto);
  }
  a { text-decoration: none; }
  img { max-width: 100%; height: auto; display: block; }

  .vk-container {
    max-width: 480px;
    margin: 0 auto;
    padding: 16px;
  }

  .vk-topVakinha {
    text-align: center;
    margin-bottom: 16px;
  }
  .vk-topVakinha .vk-categoria {
    font-size: 11px;
    text-transform: uppercase;
    color: #666;
    letter-spacing: 1px;
  }
  .vk-topVakinha h1 {
    font-size: 20px;
    font-weight: 700;
    color: #282828;
    margin: 6px 0 4px;
    line-height: 1.3;
  }
  .vk-topVakinha .vk-id {
    font-size: 12px;
    color: #888;
  }

  .vk-galeria {
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    margin-bottom: 14px;
  }
  .vk-galeria img {
    width: 100%;
    height: 240px;
    object-fit: cover;
    object-position: center top;
  }

  .vk-hearts-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 14px;
  }
  .vk-hearts-avatars {
    display: flex;
    align-items: center;
  }
  .vk-av {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: 2px solid #fff;
    margin-right: -6px;
    overflow: hidden;
    font-size: 11px;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #fff;
  }
  .vk-av-as { background: #4A90D9; }
  .vk-av-green { background: var(--cor-primaria); width: 28px; height: 28px; border-radius: 50%; border: 2px solid #fff; margin-right: -6px; display:flex; align-items:center; justify-content:center; }
  .vk-av-im { background: #E74C3C; }
  .vk-av-lo { background: #F39C12; }
  .vk-av-kc { background: #8E44AD; }
  .vk-plus-sign {
    font-size: 14px;
    font-weight: 700;
    color: var(--cor-texto);
    margin-left: 10px;
  }
  .vk-heart-count {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 13px;
    color: var(--cor-texto);
  }
  .vk-heart-count svg { width: 15px; height: 15px; }

  .vk-perfil-box {
    background: #fff;
    padding: 14px;
    border-radius: 10px;
    margin-bottom: 14px;
  }
  .vk-perfil {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
  }
  .vk-perfil .vk-avatar {
    width: 42px;
    height: 42px;
    border-radius: 50%;
    background: #ccc;
    overflow: hidden;
    flex-shrink: 0;
    border: 2px solid #f1f0f0;
  }
  .vk-perfil .vk-avatar img { width: 100%; height: 100%; object-fit: cover; }
  .vk-dadosPerfil .vk-ativo {
    font-size: 11px;
    color: #404040;
    font-weight: 700;
    display: block;
  }
  .vk-dadosPerfil .vk-vakinhas {
    font-size: 11px;
    color: #404040;
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
  }
  .vk-bullet {
    width: 4px; height: 4px;
    border-radius: 50%;
    background: #404040;
    display: inline-block;
  }

  .vk-porcentagem {
    font-size: 13px;
    font-weight: 700;
    color: var(--cor-texto);
    margin-bottom: 4px;
    display: block;
  }
  .vk-barra-total {
    height: 10px;
    background: #f1f0f0;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 8px;
  }
  .vk-barra-parcial {
    background: var(--cor-primaria);
    height: 100%;
    border-radius: 15px;
  }
  .vk-arrecadado-val {
    font-size: 22px;
    font-weight: 700;
    color: var(--cor-primaria);
  }
  .vk-arrecadado-meta {
    font-size: 14px;
    color: var(--cor-texto);
  }

  .vk-menu-detalhes {
    margin-bottom: 14px;
  }
  .vk-menu-detalhes ul {
    display: flex;
    gap: 20px;
    border-bottom: 2px solid #dfdfdf;
    list-style: none;
    padding: 0;
  }
  .vk-menu-detalhes li {
    padding: 8px 0;
    font-size: 15px;
    color: var(--cor-texto);
    cursor: pointer;
  }
  .vk-menu-detalhes li.vk-active {
    color: var(--cor-primaria);
    border-bottom: 2px solid var(--cor-primaria);
    font-weight: 700;
  }

  .vk-show-sobre {
    background: #fff;
    padding: 18px;
    border-radius: 10px;
  }
  .vk-show-sobre .vk-inicio {
    font-size: 13px;
    display: block;
    margin-bottom: 14px;
    color: #444;
  }
  .vk-show-sobre p {
    font-size: 14px;
    line-height: 1.6;
    margin-bottom: 10px;
    color: #282828;
  }

  .vk-btn-ajudar {
    display: block;
    width: 100%;
    background: var(--cor-primaria);
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 15px;
    font-size: 17px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 20px;
    font-family: "Montserrat", sans-serif;
    transition: background 0.2s;
  }
  .vk-btn-ajudar:hover { background: var(--cor-secundaria); }

  #vk-fixed-mobile {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    padding: 12px 16px;
    background: #fff;
    box-shadow: 0 -2px 6px rgba(0,0,0,0.1);
    z-index: 50;
  }

  #vk-social-proof-popup {
    display: flex;
    position: fixed;
    bottom: 80px;
    left: 16px;
    z-index: 1000;
    background: #fff;
    padding: 10px 16px;
    border-radius: 50px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.15);
    align-items: center;
    gap: 10px;
    border: 1px solid #f0f0f0;
    transition: 0.5s ease-in-out;
  }
  #vk-social-proof-popup .vk-sp-avatar {
    width: 36px; height: 36px; flex-shrink: 0;
  }
  .vk-sp-nome { font-size: 13px; font-weight: 700; color: #333; white-space: nowrap; }
  .vk-sp-info { font-size: 11px; color: #666; white-space: nowrap; }
  .vk-sp-valor { color: var(--cor-primaria); font-weight: 700; }
  .vk-sp-tempo { font-size: 10px; color: #999; text-transform: uppercase; margin-top: 2px; }

  #vk-modalDoacao {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(4px);
  }
  .vk-modal-inner {
    background: #fff;
    padding: 28px 24px;
    border-radius: 24px;
    width: 90%;
    max-width: 400px;
    position: relative;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
  }
  .vk-modal-close {
    position: absolute;
    top: 12px; right: 18px;
    font-size: 26px;
    color: #ccc;
    cursor: pointer;
    background: none;
    border: none;
    font-family: "Montserrat", sans-serif;
  }
  .vk-modal-inner h2 {
    font-size: 20px;
    font-weight: 700;
    color: #1c1e21;
    margin: 8px 0 4px;
  }
  .vk-modal-inner p {
    font-size: 14px;
    color: #65676b;
    margin-bottom: 20px;
  }
  .vk-donation-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 20px;
  }
  .vk-donation-grid button {
    padding: 13px 5px;
    border: 2px solid var(--cor-primaria);
    background: #fff;
    color: var(--cor-primaria);
    border-radius: 12px;
    font-weight: 700;
    font-size: 14px;
    cursor: pointer;
    font-family: "Montserrat", sans-serif;
    transition: 0.2s;
  }
  .vk-donation-grid button:hover {
    background: var(--cor-primaria);
    color: #fff;
  }
  .vk-donation-grid button.vk-highlight {
    background: var(--cor-primaria);
    color: #fff;
    border: none;
    box-shadow: 0 4px 12px rgba(36,202,104,0.4);
  }
  .vk-mais-doado-wrap { position: relative; }
  .vk-mais-doado-badge {
    position: absolute;
    top: -13px; left: 50%;
    transform: translateX(-50%);
    background: #ffc107;
    color: #000;
    font-size: 9px;
    padding: 3px 8px;
    border-radius: 6px;
    font-weight: 800;
    white-space: nowrap;
    z-index: 1;
  }
  .vk-custom-value-box {
    background: #f8f9fa;
    padding: 14px;
    border-radius: 14px;
    margin-bottom: 16px;
  }
  .vk-custom-value-box label {
    display: block;
    font-size: 11px;
    color: #65676b;
    font-weight: 700;
    margin-bottom: 8px;
  }
  .vk-custom-value-box input {
    width: 100%;
    padding: 11px;
    border: 2px solid #e1e4e8;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    margin-bottom: 8px;
    font-family: "Montserrat", sans-serif;
    outline: none;
  }
  .vk-custom-value-box input:focus { border-color: var(--cor-primaria); }
  .vk-custom-value-box .vk-btn-confirmar {
    width: 100%;
    background: var(--cor-primaria);
    color: #fff;
    border: none;
    padding: 13px;
    border-radius: 10px;
    font-weight: 700;
    font-size: 15px;
    cursor: pointer;
    font-family: "Montserrat", sans-serif;
  }
  .vk-pix-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 12px;
    color: var(--cor-primaria);
    font-weight: 700;
  }
  .vk-pix-info svg { width: 15px; height: 15px; fill: var(--cor-primaria); }

  .vk-comments-section {
    max-width: 480px;
    margin: 20px auto 100px;
    padding: 0 16px;
  }
  .vk-comments-box {
    background: #fff;
    border: 1px solid #e1e4e8;
    border-radius: 12px;
    padding: 18px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  .vk-comments-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eee;
    padding-bottom: 12px;
    margin-bottom: 16px;
  }
  .vk-comments-header span { font-size: 16px; font-weight: 700; color: #1c1e21; }
  .vk-comments-header small { font-size: 12px; color: #65676b; cursor: pointer; }
  .vk-comment { display: flex; margin-bottom: 16px; gap: 10px; }
  .vk-comment-avatar {
    width: 40px; height: 40px;
    border-radius: 50%;
    flex-shrink: 0;
    overflow: hidden;
  }
  .vk-comment-avatar svg { width: 40px; height: 40px; }
  .vk-comment-body {
    background: #f0f2f5;
    padding: 10px 14px;
    border-radius: 16px;
    flex: 1;
  }
  .vk-comment-name { font-weight: 700; color: #050505; font-size: 13px; margin-bottom: 3px; }
  .vk-comment-text { font-size: 13px; line-height: 1.5; color: #050505; }
  .vk-comment-actions { margin-top: 6px; font-size: 11px; color: #65676b; font-weight: 600; }
  .vk-comment-actions span { cursor: pointer; }
  .vk-reply-comment {
    margin-left: 50px;
    border-left: 2px solid #ebedf0;
    padding-left: 12px;
    margin-bottom: 16px;
  }
  .vk-reply-comment .vk-comment { margin-bottom: 0; }
  .vk-reply-comment .vk-comment-avatar { width: 32px; height: 32px; }
  .vk-reply-comment .vk-comment-avatar svg { width: 32px; height: 32px; }
  .vk-comments-more {
    text-align: center;
    padding: 10px 0 0;
    border-top: 1px solid #eee;
    font-size: 12px;
    color: #65676b;
    font-weight: 700;
    cursor: pointer;
  }
`;

const AjudeNosPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("sobre");
  const [showModal, setShowModal] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [popupVisible, setPopupVisible] = useState(false);
  const [popupData, setPopupData] = useState({ nome: "Carlos João", valor: "R$ 150,00", tempo: "Há 1 minuto" });

  const nomes = ["Ana Silva","João Costa","Maria Oliveira","Carlos Pereira","Lucas Almeida","Sofia Martins","Pedro Santos","Fernanda Melo","Eduardo Lima","Isabela Dias"];
  const valores = ["30,00","50,00","40,00","100,00","150,00","35,00","200,00","60,00"];
  const tempos = ["Há 1 minuto","Há 2 minutos","Há 3 minutos","Há 5 minutos","Há 7 minutos"];

  useEffect(() => {
    const mostrarPopup = () => {
      const nome = nomes[Math.floor(Math.random() * nomes.length)];
      const valor = "R$ " + valores[Math.floor(Math.random() * valores.length)];
      const tempo = tempos[Math.floor(Math.random() * tempos.length)];
      setPopupData({ nome, valor, tempo });
      setPopupVisible(true);
      setTimeout(() => setPopupVisible(false), 6000);
    };
    const timer = setTimeout(() => {
      mostrarPopup();
      const interval = setInterval(mostrarPopup, 30000);
      return () => clearInterval(interval);
    }, 3000);
    return () => clearTimeout(timer);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const irParaPagamento = (valor: number) => {
    setShowModal(false);
    navigate(`/pagamentos?valor=${valor.toFixed(2)}`);
  };

  const irParaPagamentoPersonalizado = () => {
    const v = parseFloat(customValue);
    if (isNaN(v) || v < 20) {
      alert("O valor mínimo para doação é de R$ 20,00.");
      return;
    }
    irParaPagamento(v);
  };

  return (
    <>
      <style>{css}</style>
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700&display=swap" rel="stylesheet" />
      <VakinhaHeader />

      <div className="vk-container">
        {/* TOP */}
        <div className="vk-topVakinha">
          <span className="vk-categoria">TRAGÉDIAS / DESASTRES</span>
          <h1>Lama, destruição e hora de recomeço. Ajude famílias de Minas Gerais a recomeçar</h1>
          <span className="vk-id">ID: IKEVW2ZUHYEF</span>
        </div>

        {/* GALERIA */}
        <div className="vk-galeria">
          <img
            src="https://static.vakinha.com.br/uploads/vakinha/image/5967476/1771980471.567.jpg"
            alt="Padre Lucas"
            onError={(e) => {
              const t = e.currentTarget;
              t.style.background = "#1a1a2e";
              t.style.height = "240px";
              t.removeAttribute("src");
            }}
          />
        </div>
        {/* CORAÇÕES */}
        <div className="vk-hearts-row">
          <div className="vk-hearts-avatars">
            <div className="vk-av vk-av-as">AS</div>
            <div className="vk-av-green">
              <svg viewBox="0 0 18 16" width="14" height="14">
                <path d="M9 2A5.1 5.1,0,0,0,3,.4C.6,1.1-.4,3.6,0,6.1.7,9.9,4.9,13.7,8.5,15.1a1.6 1.6,0,0,0,1.1,0C13.3,13.7,17.4,9.9,18.1,6.1a5.7 5.7,0,0,0,.1-0.9V4.5A4.4 4.4,0,0,0,14.9,.4a4.7 4.7,0,0,0-5.9,1.6" fill="#fff" />
              </svg>
            </div>
            <div className="vk-av vk-av-im">IM</div>
            <div className="vk-av vk-av-lo">LO</div>
            <div className="vk-av vk-av-kc">KC</div>
            <span className="vk-plus-sign">+</span>
          </div>
          <div className="vk-heart-count">
            <span><strong>5099</strong> corações recebidos</span>
            <svg viewBox="0 0 18.319 15.34">
              <path d="M9.16,2.184A5.647,5.647,0,0,0,3.174.242C.695,1.027-.329,3.754.092,6.165c.667,3.826,4.845,7.644,8.459,9.055a1.678,1.678,0,0,0,.6.12h.032a1.633,1.633,0,0,0,.59-.12c3.649-1.445,7.792-5.229,8.46-9.055a6.259,6.259,0,0,0,.091-1.012V5.048A4.864,4.864,0,0,0,15.145.242,5.119,5.119,0,0,0,13.6,0,5.855,5.855,0,0,0,9.16,2.184" fill="#24CA68" />
            </svg>
          </div>
        </div>

        {/* PERFIL + PROGRESSO */}
        <div className="vk-perfil-box">
          <div className="vk-perfil">
            <div className="vk-avatar">
              <svg viewBox="0 0 48 48" width="42" height="42">
                <circle cx="24" cy="24" r="24" fill="#bbb" />
                <circle cx="24" cy="18" r="8" fill="#fff" />
                <path d="M12 36c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </svg>
            </div>
            <div className="vk-dadosPerfil">
              <span className="vk-ativo">Ativo(a) no Vakinha desde 24/02/2026</span>
              <span className="vk-vakinhas">
                1 vaquinhas criada <span className="vk-bullet"></span> 1 vaquinha apoiada
              </span>
            </div>
          </div>
          <span className="vk-porcentagem">73%</span>
          <div className="vk-barra-total">
            <div className="vk-barra-parcial" style={{ width: "73%" }}></div>
          </div>
          <div style={{ marginTop: 6 }}>
            <span className="vk-arrecadado-val">R$ 221.874,60</span>
            <span className="vk-arrecadado-meta"> de R$ 300.000,00</span>
          </div>
        </div>

        {/* TABS */}
        <nav className="vk-menu-detalhes">
          <ul>
            {["sobre", "novidades", "quem-ajudou"].map((tab) => (
              <li
                key={tab}
                className={activeTab === tab ? "vk-active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "sobre" ? "Sobre" : tab === "novidades" ? "Novidades" : "Quem ajudou"}
              </li>
            ))}
          </ul>
        </nav>

        {/* SOBRE */}
        {activeTab === "sobre" && (
          <div className="vk-show-sobre">
            <span className="vk-inicio"><strong>Vaquinha criada em:</strong> 24/02/2026</span>
            <p><strong>✅ Vaquinha Verificada</strong></p>
            <p><strong>Ajude famílias de Minas Gerais a recomeçar</strong></p>
            <p>As chuvas que atingiram <strong>Minas Gerais em fevereiro de 2026</strong> foram devastadoras. Em questão de horas, famílias inteiras viram tudo que construíram a vida inteira ser levado pela enchente. Casa, móveis, documentos, roupas — <strong>tudo embaixo da lama.</strong></p>
            <p>Tem criança que dormiu no chão frio. Tem idoso que perdeu os remédios. Tem mãe que ficou sem fraldas pro bebê. Gente que não tem pra onde ir, sem ter o que comer, <strong>esperando uma ajuda que demora a chegar.</strong></p>
            <p>Não é notícia de TV não. É a <strong>realidade de milhares de famílias mineiras agora</strong>, nesse momento, enquanto você lê isso aqui.</p>
            <p><strong>Bairros inteiros submersos. Estradas cortadas. Pontes destruídas.</strong> Famílias ilhadas sem acesso a água potável, comida ou abrigo. O Corpo de Bombeiros trabalhando sem parar, mas a <strong>dimensão da tragédia é grande demais</strong> pra poucos conseguirem resolver.</p>
            <p>O que a gente tá pedindo não é muito. Com pouquinho de cada um, a gente consegue:</p>
            <p><strong>Cestas básicas</strong> pra quem tá sem comer</p>
            <p><strong>Água potável e kits de higiene</strong> pra quem tá sem nada</p>
            <p><strong>Colchões e cobertores</strong> pra quem tá dormindo no chão</p>
            <p><strong>Fraldas, leite e roupas</strong> pra crianças e bebês</p>
            <p><strong>Material de limpeza</strong> pra ajudar quem começar a reconstruir</p>
            <p>Cada real doado vai <strong>direto pra compra de itens de emergência</strong> e entrega nas comunidades mais afetadas. Sem enrolação, sem burocracia, sem desvio. <strong>Povo ajudando povo</strong>, do jeito que o brasileiro sabe fazer.</p>
            <p>Se você tem condição de ajudar, <strong>não deixa pra depois</strong>. Esses vizinhos nossos precisam agora. Não semana que vem. <strong>Agora.</strong></p>
            <p>Compartilha também. Um compartilhamento seu pode chegar em alguém que vai querer ajudar. <strong>Juntos a gente chega lá.</strong></p>
            <p><em>"A solidariedade começa quando a gente para de olhar e começa a agir."</em></p>
            <button className="vk-btn-ajudar" onClick={() => setShowModal(true)}>Quero Ajudar</button>
          </div>
        )}

        {activeTab === "novidades" && (
          <div className="vk-show-sobre"><p>Novidades em breve!</p></div>
        )}

        {activeTab === "quem-ajudou" && (
          <div className="vk-show-sobre"><p>Lista de apoiadores em breve!</p></div>
        )}
      </div>

      {/* COMENTÁRIOS */}
      <div className="vk-comments-section">
        <div className="vk-comments-box">
          <div className="vk-comments-header">
            <span>Comentários (14)</span>
            <small>Ordenar por: <strong>Mais recentes</strong></small>
          </div>

          <div className="vk-comment">
            <div className="vk-comment-avatar">
              <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#4CAF50" /><circle cx="24" cy="18" r="8" fill="#fff" /><path d="M12 36c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
            </div>
            <div className="vk-comment-body">
              <div className="vk-comment-name">Ana Clara</div>
              <div className="vk-comment-text">Eu ajudei com 290 reais, muito triste essa situação. Espero que consigam atingir a meta logo! 🙏</div>
              <div className="vk-comment-actions"><span>Curtir</span> • <span>Responder</span> • <span style={{ fontWeight: 400 }}>1 min</span></div>
            </div>
          </div>

          <div className="vk-comment">
            <div className="vk-comment-avatar">
              <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#2196F3" /><circle cx="24" cy="18" r="8" fill="#fff" /><path d="M12 36c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
            </div>
            <div className="vk-comment-body">
              <div className="vk-comment-name">Pedro Henrique</div>
              <div className="vk-comment-text">Ajudei de coração mesmo, olha que situação complicada... Já compartilhei no meu Facebook também.</div>
              <div className="vk-comment-actions"><span>Curtir</span> • <span>Responder</span> • <span style={{ fontWeight: 400 }}>3 min</span></div>
            </div>
          </div>

          <div className="vk-reply-comment">
            <div className="vk-comment">
              <div className="vk-comment-avatar">
                <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#9C27B0" /><circle cx="24" cy="18" r="8" fill="#fff" /><path d="M12 36c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
              </div>
              <div className="vk-comment-body">
                <div className="vk-comment-name">Gabriela Oliveira</div>
                <div className="vk-comment-text">Aqui eu ajudei com 50 reais, queria poder doar um pouco mais 😓</div>
                <div className="vk-comment-actions"><span>Curtir</span> • <span style={{ fontWeight: 400 }}>5 min</span></div>
              </div>
            </div>
          </div>

          <div className="vk-comment">
            <div className="vk-comment-avatar">
              <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#FF5722" /><circle cx="24" cy="18" r="8" fill="#fff" /><path d="M12 36c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
            </div>
            <div className="vk-comment-body">
              <div className="vk-comment-name">Marcos Antônio</div>
              <div className="vk-comment-text">Fiz uma doação agora. Que Deus abençoe todas essas famílias! 🙏❤️</div>
              <div className="vk-comment-actions"><span>Curtir</span> • <span>Responder</span> • <span style={{ fontWeight: 400 }}>8 min</span></div>
            </div>
          </div>

          <div className="vk-comment">
            <div className="vk-comment-avatar">
              <svg viewBox="0 0 48 48"><circle cx="24" cy="24" r="24" fill="#009688" /><circle cx="24" cy="18" r="8" fill="#fff" /><path d="M12 36c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" /></svg>
            </div>
            <div className="vk-comment-body">
              <div className="vk-comment-name">Luciana Ferreira</div>
              <div className="vk-comment-text">Doei R$ 100 e mandei pra vários grupos. Vamos ajudar essas famílias!</div>
              <div className="vk-comment-actions"><span>Curtir</span> • <span>Responder</span> • <span style={{ fontWeight: 400 }}>12 min</span></div>
            </div>
          </div>

          <div className="vk-comments-more">Ver mais comentários ↓</div>
        </div>
      </div>

      {/* FIXED BOTTOM */}
      <div id="vk-fixed-mobile">
        <button className="vk-btn-ajudar" onClick={() => setShowModal(true)} style={{ marginTop: 0 }}>
          Ajudar Agora
        </button>
      </div>

      {/* SOCIAL PROOF POPUP */}
      <div
        id="vk-social-proof-popup"
        style={{
          transform: popupVisible ? "translateY(0)" : "translateY(100px)",
          opacity: popupVisible ? 1 : 0,
        }}
      >
        <svg className="vk-sp-avatar" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="24" fill="#24ca68" />
          <circle cx="24" cy="18" r="8" fill="#fff" />
          <path d="M12 36c0-6.6 5.4-12 12-12s12 5.4 12 12" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
        <div>
          <div className="vk-sp-nome">{popupData.nome}</div>
          <div className="vk-sp-info">Acabou de doar <span className="vk-sp-valor">{popupData.valor}</span></div>
          <div className="vk-sp-tempo">{popupData.tempo}</div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div id="vk-modalDoacao" onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="vk-modal-inner">
            <button className="vk-modal-close" onClick={() => setShowModal(false)}>×</button>
            <h2>Qual valor deseja doar?</h2>
            <p>Sua ajuda faz toda a diferença agora.</p>
            <div className="vk-donation-grid">
              <button onClick={() => irParaPagamento(20)}>R$ 20</button>
              <button onClick={() => irParaPagamento(30)}>R$ 30</button>
              <div className="vk-mais-doado-wrap">
                <span className="vk-mais-doado-badge">MAIS DOADO</span>
                <button className="vk-highlight" onClick={() => irParaPagamento(50)} style={{ width: "100%" }}>R$ 50</button>
              </div>
              <button onClick={() => irParaPagamento(100)}>R$ 100</button>
              <button onClick={() => irParaPagamento(150)}>R$ 150</button>
              <button onClick={() => irParaPagamento(200)}>R$ 200</button>
              <button onClick={() => irParaPagamento(500)}>R$ 500</button>
              <button onClick={() => irParaPagamento(750)}>R$ 750</button>
              <button onClick={() => irParaPagamento(1000)}>R$ 1.000</button>
            </div>
            <div className="vk-custom-value-box">
              <label htmlFor="vk-valorPersonalizado">DOAR OUTRO VALOR (MÍNIMO R$ 20)</label>
              <input
                type="number"
                id="vk-valorPersonalizado"
                min={20}
                placeholder="Ex: 25"
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
              />
              <button className="vk-btn-confirmar" onClick={irParaPagamentoPersonalizado}>Confirmar</button>
            </div>
            <div className="vk-pix-info">
              <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
              Pagamento Processado via PIX
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AjudeNosPage;

