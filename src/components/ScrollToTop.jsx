import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Ao trocar de rota, leva o scroll para o topo com transição suave.
 * Respeita navegação via botão "voltar" do navegador (mantém a posição anterior
 * quando a entrada do history possui uma posição salva).
 */
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    // Se houver âncora (#id), rola até ela
    if (hash) {
      const el = document.getElementById(hash.replace('#', ''))
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        return
      }
    }

    // Scroll instantâneo para o topo em mudança de rota
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    } catch {
      window.scrollTo(0, 0)
    }
    // Alguns layouts têm o scroll no elemento html ou body
    if (document.documentElement) document.documentElement.scrollTop = 0
    if (document.body) document.body.scrollTop = 0
  }, [pathname, hash])

  return null
}
