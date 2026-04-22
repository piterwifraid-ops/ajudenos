import { useState } from 'react'

const ITEMS = [
  'MAIS INFORMAÇÕES',
  'SERVIÇOS',
  'CANAIS DE ATENDIMENTO',
  'PRIVACIDADE',
  'ÓRGÃOS DO GOVERNO',
]

export default function GovFooter({ logo }) {
  const [active, setActive] = useState(null)
  return (
    <footer className="footer-gov-v2">
      <div className="container-gov">
        <div className="gov-logo-footer text-left">
          <img src={logo} alt="gov.br" />
        </div>

        <div>
          {ITEMS.map((label, idx) => (
            <div
              key={label}
              className={`footer-item ${active === idx ? 'active' : ''} ${
                idx === ITEMS.length - 1 ? 'border-b border-white/20' : ''
              }`}
            >
              <div
                className="footer-header"
                onClick={() => setActive(active === idx ? null : idx)}
              >
                <span>{label}</span>
                <svg
                  className="chevron"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                >
                  <path d="M6 9l6 6 6-6" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="footer-divider" />

        <div className="footer-copyright">
          <p>© 2026 Ministério da Educação - MEC</p>
          <p>Governo Federal</p>
        </div>
      </div>
    </footer>
  )
}
