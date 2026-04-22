import { useEffect, useState } from 'react'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Article from './components/Article.jsx'

export default function App() {
  const [location, setLocation] = useState(null)

  useEffect(() => {
    async function fetchLocation() {
      try {
        const res = await fetch('https://ipapi.co/json/')
        if (!res.ok) return
        const loc = await res.json()
        if (loc.city && loc.region) {
          setLocation({ city: loc.city, state: loc.region })
        }
      } catch (e) {
        // silencioso
      }
    }
    fetchLocation()
  }, [])

  return (
    <>
      <Header />
      <Article location={location} />
      <Footer />
    </>
  )
}
