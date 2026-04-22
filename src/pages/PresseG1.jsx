import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const HERO_IMG = 'https://jovemnomundo-gov.netlify.app/index_files/bolsa-header.png'

function trackCTAClick() {
  try {
    localStorage.setItem('presell_source', 'g1')
    localStorage.setItem('presell_cta_clicked', 'true')
  } catch {}
}

const MAIS_LIDAS = [
  'MEC abre milhares de vagas para intercâmbio com tudo pago em 2026',
  'Brasileiros superam americanos em testes de lógica e robótica.',
  'O impacto de estudar fora: Salário inicial de intercambistas no Brasil vira atrativo.',
]

const ULTIMAS = [
  {
    img: 'https://images.unsplash.com/photo-1526628953301-3e589a6a8b74?w=100&h=100&fit=crop',
    text: 'Novos acordos comerciais facilitam vistos para estudantes brasileiros.',
  },
  {
    img: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop',
    text: 'O avanço da Inteligência Artificial como disciplina obrigatória.',
  },
  {
    img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=100&h=100&fit=crop',
    text: 'Ministério da Educação estuda novas parcerias com Europa.',
  },
]

export default function PresseG1() {
  const navigate = useNavigate()
  const [location, setLocation] = useState(null)

  useEffect(() => {
    document.body.classList.add('g1-body')
    return () => document.body.classList.remove('g1-body')
  }, [])

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await fetch('https://ipapi.co/json/')
        if (!res.ok) return
        const data = await res.json()
        if (data.city && data.region) {
          setLocation({ city: data.city, state: data.region })
        }
      } catch {}
    }
    fetchLocation()
  }, [])

  function goCadastro(e) {
    e?.preventDefault()
    trackCTAClick()
    navigate('/cadastro')
  }

  const locationText = location ? (
    <>
      Inscrições já estão abertas em{' '}
      <span style={{ color: '#c4170c', fontWeight: 800 }}>
        {location.city}, {location.state}
      </span>
    </>
  ) : (
    'Inscrições abertas para jovens de 14 a 24 anos'
  )

  return (
    <div
      style={{
        fontFamily: "'Rawline', 'Source Sans 3', sans-serif",
        backgroundColor: '#f2f2f2',
        minHeight: '100vh',
      }}
    >
      <style>{`
        .g1-header { background-color: #c4170c; color: white; height: 50px; display: flex; align-items: center; position: sticky; top: 0; z-index: 1000; }
        .g1-logo { font-size: 32px; font-weight: 900; font-style: italic; letter-spacing: -2px; }
        .header-item { display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 700; text-transform: uppercase; cursor: pointer; }
        .header-item svg { fill: white; width: 20px; height: 20px; }
        .top-banner { background: #f7f7f7; padding: 20px 0; text-align: center; border-bottom: 1px solid #e5e5e5; }
        .presse-container { background-color: white; max-width: 1200px; margin: 0 auto; padding: 30px; display: grid; grid-template-columns: 1fr 340px; gap: 50px; }
        .presse-main { grid-column: 1 / 2; }
        .presse-sidebar { grid-column: 2 / 3; }
        .p-category { color: #c4170c; font-weight: 800; font-size: 14px; text-transform: uppercase; margin-bottom: 10px; }
        .p-title { font-size: clamp(28px, 5vw, 48px); line-height: 1.1; font-weight: 800; color: #333; margin-bottom: 15px; letter-spacing: -1px; }
        .p-subtitle { font-size: clamp(18px, 3vw, 22px); color: #555; margin-bottom: 20px; line-height: 1.4; font-weight: 400; }
        .p-meta { font-size: 13px; color: #999; border-top: 1px solid #eee; border-bottom: 1px solid #eee; padding: 15px 0; margin-bottom: 30px; display: flex; gap: 20px; flex-wrap: wrap; }
        .p-content p { font-size: 20px; line-height: 1.6; color: #222; margin-bottom: 25px; }
        .p-content h2 { font-size: 26px; font-weight: 800; color: #333; margin: 40px 0 15px; }
        .p-highlight { background: #fff8f8; border-left: 4px solid #c4170c; padding: 15px 20px; margin: 25px 0; border-radius: 0 4px 4px 0; font-size: 16px; }
        .g1-cta-box { border: 1px solid #e2e8f0; border-left: 4px solid #c4170c; padding: 20px; margin: 30px 0; background: #fafafa; }
        .g1-cta-box a { color: #c4170c; font-weight: 800; text-decoration: none; font-size: 18px; cursor: pointer; }
        .g1-cta-box a:hover { text-decoration: underline; }
        .p-featured { width: 100%; border-radius: 4px; margin-bottom: 10px; }
        .p-caption { font-size: 14px; color: #777; margin-bottom: 40px; line-height: 1.4; padding-bottom: 15px; border-bottom: 1px solid #eee; }
        .p-cta-btn { display: inline-block; background-color: #c4170c; color: white; padding: 20px 40px; font-size: 22px; font-weight: 900; border-radius: 8px; text-transform: uppercase; transition: transform 0.2s; text-decoration: none; text-align: center; width: 100%; letter-spacing: 0.5px; cursor: pointer; border: none; }
        .p-cta-btn:hover { transform: scale(1.02); background-color: #a3130a; }
        .p-sidebar-title { font-size: 16px; font-weight: 900; color: #c4170c; border-bottom: 3px solid #c4170c; padding-bottom: 8px; margin-bottom: 25px; text-transform: uppercase; }
        .p-related { display: flex; gap: 15px; margin-bottom: 25px; text-decoration: none; color: inherit; cursor: pointer; }
        .p-related:hover .p-related-text { color: #c4170c; }
        .p-related-thumb { width: 110px; height: 80px; background: #eee; border-radius: 4px; object-fit: cover; flex-shrink: 0; }
        .p-related-text { font-size: 15px; font-weight: 700; color: #333; line-height: 1.3; }
        .g1-footer-official { background-color: #c4170c; color: white; padding: 25px 0; font-family: Arial, sans-serif; margin-top: 60px; }
        @media (max-width: 1000px) {
            .presse-container { grid-template-columns: 1fr; padding: 15px; }
            .presse-sidebar { grid-column: 1; border-top: 1px solid #eee; padding-top: 30px; margin-top: 20px; }
            .presse-main { grid-column: 1; }
        }
      `}</style>

      {/* Top Banner */}
      <div className="top-banner">
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 16px' }}>
          <img
            src={HERO_IMG}
            alt="Publicidade"
            style={{
              height: 60,
              objectFit: 'cover',
              width: '100%',
              borderRadius: 0,
            }}
          />
          <div
            style={{
              fontSize: 10,
              color: '#9ca3af',
              marginTop: 4,
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Publicidade
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="g1-header">
        <div
          style={{
            maxWidth: 1200,
            margin: '0 auto',
            padding: '0 16px',
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <div className="header-item">
              <svg viewBox="0 0 24 24">
                <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
              </svg>
              <span className="hidden sm:inline">MENU</span>
            </div>
            <span className="g1-logo">g1</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="header-item">
              <svg viewBox="0 0 24 24">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <span>BUSCAR</span>
            </div>
            <div className="header-item" style={{ borderLeft: '1px solid rgba(255,255,255,0.2)', paddingLeft: 15 }}>
              <svg viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
              </svg>
              <span>ENTRAR COM GLOBO</span>
            </div>
          </div>
        </div>
      </header>

      <div className="presse-container" style={{ marginTop: 24 }}>
        <div className="presse-main">
          <div className="p-category">EDUCAÇÃO &amp; TECNOLOGIA</div>
          <h1 className="p-title">
            CHAMADA PÚBLICA Nº 04/2026 – SELEÇÃO PARA O PROGRAMA DE MOBILIDADE
            ESTUDANTIL JOVEM NO MUNDO 2026
          </h1>
          <p className="p-subtitle">
            Governo Federal anuncia programa que enviará estudantes para imersão
            em tecnologia e novos idiomas em centros globais de inovação.{' '}
            {locationText}.
          </p>
          <div className="p-meta">
            <span>Por <strong>G1</strong> — Brasília</span>
            <span>19/04/2026 09h15 • Atualizado há 2 horas</span>
          </div>

          <img
            src={HERO_IMG}
            alt="Estudantes brasileiros comemorando aprovação em intercâmbio"
            className="p-featured"
          />
          <div className="p-caption">
            Programa Jovem no Mundo 2026 visa capacitar estudantes em línguas
            estrangeiras e tecnologias emergentes.
            <div style={{ color: '#bbb', fontSize: 12, marginTop: 4 }}>
              Foto: MEC/Divulgação
            </div>
          </div>

          <div className="p-content">
            <p>
              O Ministério da Educação (MEC) anunciou nesta quarta-feira a
              abertura das inscrições para o{' '}
              <strong>Programa Jovem no Mundo 2026</strong>. A iniciativa visa
              preparar estudantes brasileiros para o mercado global, unindo o
              aprendizado de novos idiomas com imersão em{' '}
              <strong>Inteligência Artificial, Programação e Tecnologias de Ponta</strong>.
            </p>

            <p>
              O programa é destinado a alunos do ensino fundamental, médio e
              superior da rede pública. Por conta do avanço tecnológico
              acelerado no exterior, o governo busca proporcionar aos jovens
              brasileiros o contato direto com o que há de mais moderno no
              mundo.
            </p>

            <div className="p-highlight">
              <strong>⚠️ REQUISITO:</strong> Podem participar estudantes de 14 a
              24 anos que estejam cursando ensino fundamental, médio ou
              faculdade.
            </div>

            <h2>Foco em Inovação</h2>

            <p>
              Os estudantes selecionados terão acesso a cursos intensivos em
              países que lideram a corrida tecnológica. O objetivo é que voltem
              ao Brasil com domínio de uma nova língua e conhecimentos
              avançados em tecnologia. Os destinos incluem:
            </p>

            <ul style={{ listStyle: 'disc', marginLeft: 32, marginBottom: 24, fontSize: 18 }}>
              <li><strong>Estados Unidos</strong> (IA e Ciência de Dados)</li>
              <li><strong>Canadá</strong> (Desenvolvimento de Software e Inglês)</li>
              <li><strong>Irlanda</strong> (Hubs de Tecnologia e Inovação)</li>
              <li><strong>Austrália</strong> (Tecnologia Sustentável e Programação)</li>
            </ul>

            <p>
              A bolsa cobre 100% dos custos de passagens aéreas, hospedagem,
              alimentação, material didático tecnológico e uma ajuda de custo
              mensal (bolsa-auxílio).
            </p>

            <h2>Regras do Seguro Saúde Obrigatório</h2>

            <p>
              Embora o MEC cubra todos os custos de viagem e estadia, o
              regulamento internacional de mobilidade acadêmica exige que o
              estudante seja titular de um{' '}
              <strong>Seguro Saúde Internacional Particular (Padrão e-Visa)</strong>.
            </p>

            <p>
              Este seguro é o único custo sob responsabilidade do estudante no
              ato da inscrição, servindo para garantir atendimento médico
              completo no exterior sem custos adicionais para o governo
              anfitrião. O valor é reduzido graças a um subsídio especial do
              programa federal.
            </p>

            <div className="g1-cta-box">
              <p
                style={{
                  marginBottom: 8,
                  fontSize: 14,
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  fontWeight: 700,
                }}
              >
                Acesso ao Sistema do MEC
              </p>
              <p style={{ fontSize: 16, marginBottom: 8 }}>
                Veja como é fácil realizar a inscrição pelo celular.
              </p>
              <a onClick={goCadastro}>
                LEIA MAIS: Clique aqui para acessar o Portal Oficial do Programa
                Jovem no Mundo e garantir sua vaga
              </a>
            </div>

            <p>O processo é simples e pode ser feito totalmente pelo celular:</p>

            <ol style={{ listStyle: 'decimal', marginLeft: 32, marginBottom: 24, fontSize: 18 }}>
              <li>
                <strong>Acesse o Portal Oficial</strong> (usando o link de
                destaque acima ou o botão abaixo)
              </li>
              <li>
                <strong>Confirme seus dados</strong> e vínculo com escola
                pública ou particular
              </li>
              <li>
                <strong>Escolha o destino</strong> de sua preferência
              </li>
              <li>
                <strong>Efetue o pagamento do Seguro Obrigatório</strong> para
                emitir seu Certificado de Intercambista
              </li>
            </ol>

            <div style={{ textAlign: 'center', margin: '50px 0' }}>
              <p
                style={{
                  fontSize: 14,
                  color: '#6b7280',
                  marginBottom: 16,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                }}
              >
                Link para Inscrição Direta ↓
              </p>
              <button onClick={goCadastro} className="p-cta-btn">
                ACESSAR PORTAL DO MEC
              </button>
            </div>

            {/* Comentários */}
            <div style={{ marginTop: 48, borderTop: '1px solid #e5e7eb', paddingTop: 32 }}>
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 24 }}>
                482 Comentários
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                <Comment
                  name="Marcos Oliveira"
                  text="Acabei de fazer o meu! Moro em Várzea Grande e deu certinho. Ansioso para o intercâmbio."
                  when="há 12 minutos"
                />
                <Comment
                  name="Juliana Costa"
                  text="Gente, é real mesmo? Alguém já recebeu o certificado?"
                  when="há 25 minutos"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="presse-sidebar">
          <div className="p-sidebar-title">MAIS LIDAS DO G1</div>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              marginBottom: 40,
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: 32,
            }}
          >
            {MAIS_LIDAS.map((t, i) => (
              <div
                key={i}
                onClick={goCadastro}
                style={{ display: 'flex', gap: 16, cursor: 'pointer' }}
              >
                <span
                  style={{
                    fontSize: 30,
                    fontWeight: 900,
                    color: '#e5e7eb',
                    lineHeight: 1,
                  }}
                >
                  {i + 1}
                </span>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: '#1f2937',
                    paddingTop: 8,
                    lineHeight: 1.3,
                  }}
                >
                  {t}
                </p>
              </div>
            ))}
          </div>

          <div className="p-sidebar-title">ÚLTIMAS DE EDUCAÇÃO</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {ULTIMAS.map((r) => (
              <div key={r.text} onClick={goCadastro} className="p-related">
                <img src={r.img} className="p-related-thumb" alt="" />
                <div className="p-related-text">{r.text}</div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      <footer className="g1-footer-official">
        <div
          style={{
            maxWidth: 1140,
            margin: '0 auto',
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: 32, fontWeight: 900, fontStyle: 'italic', letterSpacing: -2 }}>
              g1
            </span>
            <span
              style={{
                fontWeight: 700,
                fontSize: 14,
                textTransform: 'uppercase',
                opacity: 0.9,
              }}
            >
              últimas notícias
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 16,
              fontSize: 11,
              fontWeight: 700,
              textTransform: 'uppercase',
              opacity: 0.9,
            }}
          >
            <a style={{ cursor: 'pointer' }}>princípios editoriais</a>
            <span>|</span>
            <a style={{ cursor: 'pointer' }}>política de privacidade</a>
            <span>|</span>
            <a style={{ cursor: 'pointer' }}>minha conta</a>
            <span>|</span>
            <a style={{ cursor: 'pointer' }}>anuncie conosco</a>
          </div>
          <div style={{ fontSize: 10, opacity: 0.7, textAlign: 'center' }}>
            © Copyright 2000-2026 Globo Comunicação e Participações S.A.
          </div>
        </div>
      </footer>
    </div>
  )
}

function Comment({ name, text, when }) {
  return (
    <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid #e5e7eb', paddingBottom: 16 }}>
      <div
        style={{
          width: 40,
          height: 40,
          background: '#e5e7eb',
          borderRadius: '50%',
          flexShrink: 0,
        }}
      />
      <div>
        <div style={{ fontWeight: 700, fontSize: 14, color: '#2563eb' }}>
          {name}
        </div>
        <p style={{ fontSize: 14, color: '#374151', marginTop: 4 }}>{text}</p>
        <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 8 }}>
          {when} • Responder
        </div>
      </div>
    </div>
  )
}
