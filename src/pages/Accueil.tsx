import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGroup, motion, useAnimate, useReducedMotion } from 'motion/react'
import { EASE_SORTIE } from '../lib/mouvement'
import { DEMO } from '../data/demo'
import { useEvenements } from '../data/evenements'
import { useReglages } from '../data/reglages'
import { usePublications } from '../data/publications'
import { THEMES, type Theme } from '../data/types'
import { Banderole } from '../components/Banderole'
import { CartePublication } from '../components/CartePublication'
import { formatJourMois, formatMoisCourt, numeroJour } from '../lib/format'
import { SITE } from '../config'

const PAQUET = 10

export function Accueil() {
  const [filtre, setFiltre] = useState<Theme | null>(null)
  // Changement de filtre : la liste réapparaît en 180 ms (fondu + léger glissement) pour montrer
  // que le contenu a changé. Pas au premier affichage ; sans glissement si « réduire les animations ».
  const [liste, animerListe] = useAnimate()
  const reduit = useReducedMotion()
  const premierFiltre = useRef(true)
  // Activé au clavier (Entrée, Espace) : changement immédiat, sans animation (règle du site).
  const parClavier = useRef(false)
  useEffect(() => {
    if (premierFiltre.current) {
      premierFiltre.current = false
      return
    }
    if (!liste.current || parClavier.current) return
    void animerListe(
      liste.current,
      reduit ? { opacity: [0, 1] } : { opacity: [0, 1], transform: ['translateY(6px)', 'translateY(0px)'] },
      { duration: 0.18, ease: EASE_SORTIE },
    )
  }, [filtre, reduit, animerListe, liste])
  const [nombre, setNombre] = useState(PAQUET)
  const sentinelle = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `${SITE.nom} — actualités`
  }, [])

  const publications = usePublications()
  const evenements = useEvenements()
  const reglages = useReglages()
  const epinglee = publications.find((p) => p.epingle)
  const fil = useMemo(
    () =>
      publications
        .filter((p) => p !== epinglee && (!filtre || p.theme === filtre))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [publications, filtre, epinglee],
  )
  const visibles = fil.slice(0, nombre)
  const aujourdhui = new Date().toLocaleDateString('sv-SE')
  const prochains = evenements
    .filter((e) => e.date >= aujourdhui)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  // Chargement progressif au défilement (prêt pour Firestore à l'étape 2).
  useEffect(() => {
    const el = sentinelle.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setNombre((n) => (n < fil.length ? n + PAQUET : n)),
      { rootMargin: '600px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [fil.length])

  return (
    <main id="contenu">
      {epinglee && <Banderole pub={epinglee} />}

      {prochains[0] && (
        <Link
          to="/agenda"
          className="block bg-jaune text-encre lg:hidden"
          aria-label={`Prochain rendez-vous : ${prochains[0].titre}, ${formatJourMois(prochains[0].date)}. Voir l’agenda`}
        >
          <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-4 sm:px-6">
            <div className="flex size-16 shrink-0 flex-col items-center justify-center bg-encre text-jaune">
              <span className="font-condensed text-4xl leading-none font-[900]">{numeroJour(prochains[0].date)}</span>
              <span className="text-xs font-bold">{formatMoisCourt(prochains[0].date)}</span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold">Prochain rendez-vous</p>
              <p className="font-condensed text-2xl leading-tight font-[850] text-balance">{prochains[0].titre}</p>
              <p className="text-sm">{[prochains[0].heure, prochains[0].lieu].filter(Boolean).join(', ')}</p>
            </div>
          </div>
        </Link>
      )}

      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 pt-8 sm:px-6 lg:grid-cols-[minmax(0,640px)_1fr] lg:gap-14 lg:pt-12">
        <section aria-labelledby="titre-fil">
          <div className="px-4 sm:px-0">
            <h2 id="titre-fil" className="font-condensed text-4xl font-[850]">{reglages.accueilTitreFil}</h2>
            {DEMO && (
              <p className="mt-2 text-sm text-muted">
                Contenu de démonstration. Les vraies publications arriveront avec le mode administrateur.
              </p>
            )}
          </div>

          <LayoutGroup>
            <div
              role="group"
              aria-label="Filtrer par thème"
              className="mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {[null, ...THEMES].map((t) => {
                const actif = filtre === t
                return (
                  <button
                    key={t ?? 'tout'}
                    type="button"
                    onClick={(e) => {
                      // detail === 0 : clic déclenché au clavier, pas au toucher ni à la souris.
                      parClavier.current = e.detail === 0
                      setFiltre(t)
                      setNombre(PAQUET)
                    }}
                    aria-pressed={actif}
                    className={`appui relative isolate shrink-0 rounded-full border px-4 py-2 font-semibold ${
                      actif ? 'border-transparent text-white' : 'border-rule text-muted hover:text-[var(--text)]'
                    }`}
                  >
                    {actif && (
                      <motion.span
                        layoutId="filtre-actif"
                        className="absolute inset-0 -z-10 rounded-full bg-encre dark:bg-rouge"
                        transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
                      />
                    )}
                    <span className="relative">{t ?? 'Tout'}</span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>

          <div ref={liste} className="mt-6 flex flex-col gap-0 sm:gap-6">
            {visibles.map((p) => (
              <CartePublication key={p.id} pub={p} />
            ))}
            {visibles.length === 0 && (
              <p className="px-4 py-12 text-muted sm:px-0">
                Pas encore de publication dans ce thème.{' '}
                <button type="button" className="font-semibold text-rouge-texte underline" onClick={() => setFiltre(null)}>
                  Voir tout le fil
                </button>
              </p>
            )}
          </div>
          <div ref={sentinelle} aria-hidden="true" />
          {visibles.length > 0 && visibles.length >= fil.length && (
            <p className="px-4 pt-10 text-center text-muted sm:px-0">Vous êtes à jour.</p>
          )}
        </section>

        <aside className="px-4 sm:px-0">
          <div className="flex flex-col gap-10 lg:sticky lg:top-24">
            <section aria-labelledby="titre-agenda">
              <div className="flex items-baseline justify-between">
                <h2 id="titre-agenda" className="font-condensed text-3xl font-[850]">Prochains rendez-vous</h2>
                <Link to="/agenda" className="font-semibold text-rouge-texte hover:underline">Agenda</Link>
              </div>
              {prochains.length === 0 && (
                <p className="mt-4 border-y border-rule py-4 text-muted">
                  Pas de rendez-vous annoncé pour l’instant. Les prochaines dates seront publiées ici.
                </p>
              )}
              <ol className="mt-4 divide-y divide-[var(--rule)] border-y border-rule empty:hidden">
                {prochains.map((e) => (
                  <li key={e.id} className="flex gap-4 py-4">
                    <div className="flex size-14 shrink-0 flex-col items-center justify-center bg-jaune text-encre">
                      <div className="font-condensed text-3xl leading-none font-[900]">{numeroJour(e.date)}</div>
                      <div className="text-xs font-bold">{formatMoisCourt(e.date)}</div>
                    </div>
                    <div>
                      <p className="font-semibold leading-snug">{e.titre}</p>
                      <p className="text-sm text-muted">
                        {[e.heure, e.lieu].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            <section className="bg-rouge p-6 text-white">
              <h2 className="font-condensed text-4xl leading-none font-[850]">{reglages.accueilEncartTitre}</h2>
              <p className="mt-3 text-white/90">{reglages.accueilEncartTexte}</p>
              <Link
                to="/adherer"
                className="mt-5 inline-flex h-11 items-center rounded-full bg-white px-5 font-semibold text-rouge appui"
              >
                Adhérer
              </Link>
            </section>

            <section>
              <h2 className="font-condensed text-3xl font-[850]">{reglages.accueilAideTitre}</h2>
              <p className="mt-2 text-muted">{reglages.accueilAideTexte}</p>
              <Link to="/contact" className="mt-3 inline-block font-semibold text-rouge-texte hover:underline">
                Nous trouver et nous écrire
              </Link>
            </section>
          </div>
        </aside>
      </div>
    </main>
  )
}
