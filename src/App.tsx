import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { MotionConfig } from 'motion/react'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { Accueil } from './pages/Accueil'
import { PublicationPage } from './pages/PublicationPage'
import { Agenda } from './pages/Agenda'
import { Adherer } from './pages/Adherer'
import { Contact } from './pages/Contact'
import { MentionsLegales } from './pages/MentionsLegales'
import { Introuvable } from './pages/Introuvable'

function RemonterEnHaut() {
  const { pathname } = useLocation()
  // Accolades obligatoires : dans les navigateurs récents, scrollTo renvoie une promesse,
  // que React prendrait pour une fonction de nettoyage (écran vide au changement de page).
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <RemonterEnHaut />
        <a
          href="#contenu"
          className="sr-only z-50 rounded-full bg-rouge px-4 py-2 font-semibold text-white focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Aller au contenu
        </a>
        <Header />
        <Routes>
          <Route path="/" element={<Accueil />} />
          <Route path="/publication/:id" element={<PublicationPage />} />
          <Route path="/agenda" element={<Agenda />} />
          <Route path="/adherer" element={<Adherer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="*" element={<Introuvable />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </MotionConfig>
  )
}
