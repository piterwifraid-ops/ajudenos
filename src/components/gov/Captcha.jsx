import { useMemo, useState } from 'react'

const IMAGES = [
  { url: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=200&h=200&fit=crop', isBus: true },
  { url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=200&h=200&fit=crop', isBus: false },
  { url: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=200&h=200&fit=crop', isBus: false },
  { url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=200&h=200&fit=crop', isBus: true },
  { url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=200&h=200&fit=crop', isBus: false },
  { url: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=200&h=200&fit=crop', isBus: false },
  { url: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=200&h=200&fit=crop', isBus: false },
  { url: 'https://images.unsplash.com/photo-1464219789935-c2d9d9aba644?w=200&h=200&fit=crop', isBus: true },
  { url: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=200&h=200&fit=crop', isBus: false },
]

export default function Captcha({ onSuccess, onClose }) {
  const [selected, setSelected] = useState(new Set())
  const [error, setError] = useState(false)

  const correct = useMemo(() => {
    const s = new Set()
    IMAGES.forEach((img, i) => img.isBus && s.add(i))
    return s
  }, [])

  function toggle(i) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function verify() {
    const ok =
      correct.size === selected.size &&
      [...correct].every((i) => selected.has(i))
    if (ok) {
      onSuccess?.()
    } else {
      setError(true)
      setTimeout(() => {
        setError(false)
        setSelected(new Set())
      }, 1500)
    }
  }

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        zIndex: 9999,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: 8,
          overflow: 'hidden',
          maxWidth: 400,
          width: '90%',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
        }}
      >
        <div style={{ background: '#4285f4', color: 'white', padding: '20px 24px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 6 }}>
            Selecione todas as imagens com
          </div>
          <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.5px' }}>
            ônibus
          </div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 6 }}>
            Se não houver nenhuma, clique em Verificar.
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 3,
            padding: 3,
            background: '#ddd',
          }}
        >
          {IMAGES.map((img, i) => {
            const isSel = selected.has(i)
            return (
              <div
                key={i}
                onClick={() => toggle(i)}
                style={{
                  position: 'relative',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  aspectRatio: '1 / 1',
                  outline: isSel ? '4px solid #4285f4' : 'none',
                  outlineOffset: isSel ? -4 : 0,
                }}
              >
                <img
                  src={img.url}
                  alt="captcha"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                {isSel && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 4,
                      right: 6,
                      background: '#4285f4',
                      color: 'white',
                      width: 22,
                      height: 22,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 14,
                      fontWeight: 900,
                    }}
                  >
                    ✓
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 20px',
            borderTop: '1px solid #eee',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="11" stroke="#ccc" strokeWidth="2" />
              <path
                d="M7 12l3 3 7-7"
                stroke="#4285f4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div style={{ fontSize: 10, color: '#999', lineHeight: 1.2 }}>
              reCAPTCHA
              <br />
              <span style={{ fontSize: 8 }}>Privacidade - Termos</span>
            </div>
          </div>
          <button
            onClick={verify}
            style={{
              background: '#4285f4',
              color: 'white',
              border: 'none',
              padding: '10px 28px',
              borderRadius: 4,
              fontWeight: 700,
              fontSize: 14,
              cursor: 'pointer',
              textTransform: 'uppercase',
            }}
          >
            Verificar
          </button>
        </div>

        {error && (
          <div
            style={{
              background: '#fce4e4',
              color: '#c0392b',
              textAlign: 'center',
              padding: 10,
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            Selecione corretamente as imagens de ônibus.
          </div>
        )}
      </div>
    </div>
  )
}
