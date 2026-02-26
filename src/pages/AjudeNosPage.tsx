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
    position: relative;
  }
  .vk-galeria img {
    width: 100%;
    height: 240px;
    object-fit: cover;
    object-position: center;
    display: none;
  }
  .vk-galeria img.active {
    display: block;
    animation: fadeSlide 0.4s ease;
  }
  @keyframes fadeSlide {
    from { opacity: 0; transform: scale(1.03); }
    to   { opacity: 1; transform: scale(1); }
  }
  .carousel-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0,0,0,0.45);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #fff;
    z-index: 2;
    padding: 0;
  }
  .carousel-btn:hover { background: rgba(0,0,0,0.7); }
  .carousel-btn.prev { left: 8px; }
  .carousel-btn.next { right: 8px; }
  .carousel-dots {
    position: absolute;
    bottom: 8px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    z-index: 2;
  }
  .carousel-dots span {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: rgba(255,255,255,0.5);
    cursor: pointer;
    transition: background 0.2s;
  }
  .carousel-dots span.active {
    background: #fff;
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

  .donation-widget {
    background: #fff;
    padding: 16px;
    border-radius: 12px;
    margin-bottom: 14px;
  }
  .progress-section { margin-bottom: 16px; }
  .progress-amounts {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 8px;
  }
  .progress-raised {
    font-size: 22px;
    font-weight: 800;
    color: #1a1a1a;
  }
  .progress-goal {
    font-size: 13px;
    color: #888;
  }
  .progress-bar-bg {
    height: 10px;
    background: #f1f0f0;
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 8px;
  }
  .progress-bar-fill {
    background: var(--cor-primaria);
    height: 100%;
    border-radius: 15px;
  }
  .progress-info {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #666;
  }
  .donation-values {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 8px;
    margin-bottom: 14px;
  }
  .donation-val {
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    padding: 10px 8px;
    text-align: center;
    cursor: pointer;
    font-size: 16px;
    font-weight: 700;
    color: #1a1a1a;
    position: relative;
    transition: border-color 0.15s, background 0.15s;
  }
  .donation-val small {
    display: block;
    font-size: 11px;
    font-weight: 400;
    color: #888;
    margin-top: 2px;
  }
  .donation-val:hover, .donation-val.selected { border-color: var(--cor-primaria); background: #f0faf4; }
  .donation-val.featured { border-color: var(--cor-primaria); background: #f0faf4; }
  .donation-val .badge {
    position: absolute;
    top: -10px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--cor-primaria);
    color: #fff;
    font-size: 9px;
    font-weight: 800;
    padding: 2px 7px;
    border-radius: 20px;
    letter-spacing: 0.5px;
  }
  .share-row {
    display: flex;
    gap: 6px;
    margin: 12px 0 10px;
  }
  .share-btn {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    padding: 8px 4px;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    background: #fff;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    color: #333;
    font-family: "Montserrat", sans-serif;
    transition: background 0.15s;
  }
  .share-btn:hover { background: #f5f5f5; }
  .share-btn.whatsapp { color: #25d366; border-color: #25d366; }
  .share-btn.whatsapp:hover { background: #f0fff5; }
  .secure-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
    font-size: 11px;
    color: #888;
    margin-top: 4px;
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

  .description h2 {
    font-size: 17px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 20px 0 10px;
    line-height: 1.3;
  }
  .description p {
    font-size: 14px;
    line-height: 1.7;
    color: #333;
    margin-bottom: 12px;
  }
  .quote {
    background: #f0faf4;
    border-left: 4px solid var(--cor-primaria);
    border-radius: 6px;
    padding: 14px 16px;
    font-style: italic;
    font-size: 14px;
    color: #444;
    margin: 16px 0;
    line-height: 1.6;
  }
  .quote small {
    display: block;
    margin-top: 8px;
    font-style: normal;
    font-size: 12px;
    color: #777;
  }
  .photo-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
    margin: 16px 0;
  }
  .photo-grid img {
    width: 100%;
    height: 90px;
    object-fit: cover;
    border-radius: 6px;
    cursor: pointer;
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
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselImages = [
    { src: "https://ajudejf.com/Chuvas%20Juiz%20De%20Fora1.webp", alt: "Resgate em Juiz de Fora" },
    { src: "https://ajudejf.com/Chuvas%20Juiz%20De%20Fora2.webp", alt: "Comunidade unida na limpeza" },
    { src: "https://ajudejf.com/Chuvas%20Juiz%20De%20Fora3.webp", alt: "Cidade inundada - vista aérea" },
    { src: "https://ajudejf.com/Chuvas%20Juiz%20De%20Fora4.webp", alt: "Operação de resgate com maquinário" },
    { src: "https://ajudejf.com/Chuvas%20Juiz%20De%20Fora5.webp", alt: "Destruição e busca por sobreviventes" },
    { src: "https://ajudejf.com/Chuvas%20Juiz%20De%20Fora6.webp", alt: "Impacto da tragédia em Juiz de Fora" },
  ];
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

  useEffect(() => {
    const interval = setInterval(() => {
      setCarouselIndex(prev => (prev + 1) % carouselImages.length);
    }, 6000);
    return () => clearInterval(interval);
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
          <h1 className="campaign-title">Ajude as vítimas das chuvas em Juiz de Fora - MG</h1>
          <span className="vk-id">ID: IKEVW2ZUHYEF</span>
        </div>

        {/* GALERIA */}
        <div className="vk-galeria">
          {carouselImages.map((img, i) => (
            <img
              key={i}
              src={img.src}
              alt={img.alt}
              className={i === carouselIndex ? "active" : ""}
            />
          ))}
          <button
            className="carousel-btn prev"
            onClick={() => setCarouselIndex((carouselIndex - 1 + carouselImages.length) % carouselImages.length)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            className="carousel-btn next"
            onClick={() => setCarouselIndex((carouselIndex + 1) % carouselImages.length)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
          <div className="carousel-dots">
            {carouselImages.map((_, i) => (
              <span
                key={i}
                className={i === carouselIndex ? "active" : ""}
                onClick={() => setCarouselIndex(i)}
              />
            ))}
          </div>
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
        <div className="donation-widget">
          {/* Progress */}
          <div className="progress-section">
            <div className="progress-amounts">
              <div className="progress-raised">R$ 41.280</div>
              <div className="progress-goal">Meta: R$ 60.000</div>
            </div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: "68%" }}></div>
            </div>
            <div className="progress-info">
              <span><strong>68%</strong> arrecadado</span>
              <span><strong>347</strong> doações</span>
            </div>
          </div>

          {/* Values */}
          <div className="donation-values">
            <div className="donation-val" onClick={() => navigate("/pagamentos?valor=20.00")}>
              R$ 20<small>Ajuda básica</small>
            </div>
            <div className="donation-val featured" onClick={() => navigate("/pagamentos?valor=50.00")}>
              <span className="badge">POPULAR</span>
              R$ 50<small>Cesta parcial</small>
            </div>
            <div className="donation-val" onClick={() => navigate("/pagamentos?valor=100.00")}>
              R$ 100<small>Cesta completa</small>
            </div>
            <div className="donation-val" onClick={() => navigate("/pagamentos?valor=200.00")}>
              R$ 200<small>Kit recomeço</small>
            </div>
          </div>

          {/* CTA */}
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
            <div className="description">
              <h2>A maior tragédia da história de Juiz de Fora</h2>
              <p>
                Na noite de segunda-feira, 23 de fevereiro de 2026, um temporal histórico atingiu Juiz de
                Fora e a Zona da Mata Mineira. Em poucas horas, foram registrados mais de <strong>209
                  milímetros de chuva</strong>, com acumulado mensal chegando a <strong>589,6 mm</strong>
                — quase o triplo da média histórica de 170 mm para fevereiro. Foi o mês mais chuvoso já
                registrado na história do município.
              </p>
              <p>
                A prefeita Margarida Salomão decretou <strong>estado de calamidade pública</strong> na
                madrugada de terça-feira (24). O governo do estado decretou <strong>luto oficial de 3
                  dias</strong>.
              </p>

              <div className="quote">
                "A gente só queria acordar desse pesadelo. Mas a lama não vai embora sozinha, e o frio não
                espera a água baixar."
                <br /><small>— Moradora do bairro São Pedro</small>
              </div>

              <h2>Os números da devastação</h2>
              <p>
                <strong>• +30 mortos</strong> confirmados apenas em Juiz de Fora<br />
                <strong>• 39 pessoas desaparecidas</strong> — entre elas crianças<br />
                <strong>• +3.000 desabrigados</strong> que perderam tudo<br />
                <strong>• 208 pessoas resgatadas</strong> com vida dos escombros<br />
                <strong>• 600 famílias</strong> que precisaram deixar suas casas<br />
                <strong>• 211 ocorrências</strong> de deslizamentos em uma única noite
              </p>
              <p>
                O Rio Paraibuna transbordou em diversos pontos, isolando bairros inteiros. Os bairros mais
                atingidos foram <strong>JK, Santa Rita, Vila Ideal, Lourdes, Vila Alpina, São Benedito, Vila
                  Olavo Costa e Parque Burnier</strong> — onde 12 casas desabaram e 17 pessoas seguem
                desaparecidas.
              </p>

              <div className="photo-grid">
                <img src="https://ajudejf.com/Chuvas%20Juiz%20De%20Fora3.webp" alt="Vista aérea da enchente - Rio Paraibuna transbordado" onClick={(e) => { const t = e.target as HTMLImageElement; window.open(t.src); }} />
                <img src="https://ajudejf.com/Chuvas%20Juiz%20De%20Fora1.webp" alt="Bombeiros resgatando vítimas" onClick={(e) => { const t = e.target as HTMLImageElement; window.open(t.src); }} />
                <img src="https://ajudejf.com/Chuvas%20Juiz%20De%20Fora2.webp" alt="Comunidade unida na busca" onClick={(e) => { const t = e.target as HTMLImageElement; window.open(t.src); }} />
              </div>

              <h2>136 bombeiros em campo — mas não é suficiente</h2>
              <p>
                Ao todo, <strong>136 bombeiros militares</strong> estão empenhados nas operações de busca e
                resgate. Na madrugada de terça-feira, 13 pessoas foram resgatadas com vida. Mas as equipes
                não dão conta da demanda: familiares e voluntários cavam com as próprias mãos na lama em
                busca de seus entes queridos.
              </p>
              <p>
                <strong>A previsão é de que a chuva continue até sexta-feira (27/02).</strong> O Inmet
                mantém alerta vermelho de grande perigo para a região. A situação pode piorar a qualquer
                momento.
              </p>

              <div className="photo-grid">
                <img src="https://ajudejf.com/Chuvas%20Juiz%20De%20Fora4.webp" alt="Operação de resgate com maquinário pesado" onClick={(e) => { const t = e.target as HTMLImageElement; window.open(t.src); }} />
                <img src="https://ajudejf.com/Chuvas%20Juiz%20De%20Fora5.webp" alt="Destruição total nos bairros" onClick={(e) => { const t = e.target as HTMLImageElement; window.open(t.src); }} />
                <img src="https://ajudejf.com/Chuvas%20Juiz%20De%20Fora6.webp" alt="Impacto da tragédia" onClick={(e) => { const t = e.target as HTMLImageElement; window.open(t.src); }} />
              </div>

              <h2>Para onde vai sua doação</h2>
              <p>
                Todo o valor arrecadado será destinado exclusivamente à compra de itens de primeira
                necessidade para as mais de 3 mil pessoas desabrigadas:
              </p>
              <p>
                <strong>✓ Cestas básicas</strong> — alimentação emergencial para as próximas semanas<br />
                <strong>✓ Água potável</strong> — garrafões e kits de purificação<br />
                <strong>✓ Colchões e cobertores</strong> — para os abrigos temporários lotados<br />
                <strong>✓ Kits de higiene</strong> — produtos essenciais de limpeza pessoal<br />
                <strong>✓ Materiais de limpeza</strong> — para as famílias que começam a retornar aos escombros
              </p>

              <h2>Transparência total</h2>
              <p>
                <strong>100% do valor arrecadado</strong> é repassado diretamente às famílias atingidas.
                Toda compra é fotografada e publicada na aba de atualizações. A prestação de contas é feita
                em parceria com o comitê comunitário local de Juiz de Fora.
              </p>

              <div className="quote">
                "Ver seus filhos perguntando por que não podemos voltar pra casa é a dor mais profunda que
                um pai pode sentir. Qualquer ajuda, por menor que seja, devolve a esperança."
                <br /><small>— Pai de família do bairro Parque Burnier</small>
              </div>

              <p>
                <strong>Sua ajuda não compra apenas mantimentos. Ela compra a esperança de que amanhã será
                  diferente.</strong> Juiz de Fora é uma cidade de gente forte, mas ninguém suporta tanto
                peso sozinho. Com mais de 30 vidas perdidas e milhares sem teto, cada real faz diferença.
              </p>
            </div>
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

