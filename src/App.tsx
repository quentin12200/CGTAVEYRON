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

/**
 * Certaines extensions de « mode sombre » repeignent en noir le fond des grands blocs (page, en-tête),
 * parfois avec une priorité « utilisateur » qu'aucun style du site ne peut battre, sans changer la
 * couleur du texte : titres noirs sur fond noir. Parade : fond posé en style en ligne « important »,
 * doublé d'une image unie de la même couleur (ces extensions ne remplacent que la couleur de fond).
 */
function ProtegerLeFond() {
  const { pathname } = useLocation();
  useEffect(() => {
    const poser = () => {
      const blocs = [
        document.documentElement,
        document.body,
        document.getElementById("root"),
        document.getElementById("fond"),
        document.querySelector("header"),
        document.querySelector("main"),
        ...document.querySelectorAll<HTMLElement>("main > div"),
        ...document.querySelectorAll<HTMLElement>("aside, footer"),
      ];
      for (const el of blocs) {
        el?.style.setProperty("background-color", "var(--bg)", "important");
        // Une extension peut imposer sa couleur de fond avec une priorité « utilisateur », qui passe avant
        // tout style du site. Elle ne touche en général que la couleur : on peint donc le fond avec une
        // image unie de la même couleur, qui se dessine par-dessus.
        el?.style.setProperty("background-image", "linear-gradient(var(--bg), var(--bg))", "important");
        el?.style.setProperty("color", "var(--text)", "important");
      }
    };
    poser();
    // Si une extension ajoute ses styles après le chargement, on repose les couleurs.
    const obs = new MutationObserver(poser);
    obs.observe(document.head, { childList: true });
    return () => obs.disconnect();
  }, [pathname]);
  return null;
}

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
        <div
          id="fond"
          className="isolate flex min-h-dvh flex-col bg-[var(--bg)] text-[var(--text)]"
        >
          <RemonterEnHaut />
          <ProtegerLeFond />
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
