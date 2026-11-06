import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { MotionConfig } from "motion/react";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Accueil } from "./pages/Accueil";
import { PublicationPage } from "./pages/PublicationPage";
import { Agenda } from "./pages/Agenda";
import { Adherer } from "./pages/Adherer";
import { Contact } from "./pages/Contact";
import { MentionsLegales } from "./pages/MentionsLegales";
import { Introuvable } from "./pages/Introuvable";

// Chargée à part : les visiteurs ne téléchargent pas le code de l'administration.
const Admin = lazy(() =>
  import("./pages/Admin").then((m) => ({ default: m.Admin })),
);

function RemonterEnHaut() {
  const { pathname } = useLocation();
  // Accolades obligatoires : dans les navigateurs récents, scrollTo renvoie une promesse,
  // que React prendrait pour une fonction de nettoyage (écran vide au changement de page).
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        {/* Fond et texte posés sur le site lui-même, pas seulement sur <body> : certains navigateurs ou extensions
            de « mode sombre » repeignent le fond de la page en noir sans changer le texte, qui devient illisible. */}
        <div className="isolate flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text)]">
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
            <Route
              path="/admin"
              element={
                <Suspense
                  fallback={
                    <main
                      id="contenu"
                      className="mx-auto max-w-3xl px-4 pt-12 text-muted"
                    >
                      Chargement…
                    </main>
                  }
                >
                  <Admin />
                </Suspense>
              }
            />
            <Route path="*" element={<Introuvable />} />
          </Routes>
          <Footer />
        </div>
      </BrowserRouter>
    </MotionConfig>
  );
}
