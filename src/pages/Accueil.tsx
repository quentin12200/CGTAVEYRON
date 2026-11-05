import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutGroup, motion } from 'motion/react'
import { DEMO, evenements } from '../data/demo'
import { usePublications } from '../data/publications'
import { THEMES, type Theme } from '../data/types'
import { Banderole } from '../components/Banderole'
import { CartePublication } from '../components/CartePublication'
import { formatMoisCourt, numeroJour } from '../lib/format'
import { SITE } from '../config'

const PAQUET = 10

export function Accueil() {
  const [filtre, setFiltre] = useState<Theme | null>(null)
  const [nombre, setNombre] = useState(PAQUET)
  const sentinelle = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.title = `${SITE.nom} — actualités`
  }, [])

  const publications = usePublications()
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

      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-10 pt-8 sm:px-6 lg:grid-cols-[minmax(0,640px)_1fr] lg:gap-14 lg:pt-12">
        <section aria-labelledby="titre-fil">
          <div className="px-4 sm:px-0">
            <h2 id="titre-fil" className="font-condensed text-4xl font-[850]">Dernières publications</h2>
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
              className="mt-5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:px-0 [&::-webkit-scrollbar]:hidden"
            >
              {[null, ...THEMES].map((t) => {
                const actif = filtre === t
                return (
                  <button
                    key={t ?? 'tout'}
                    type="button"
                    onClick={() => {
                      setFiltre(t)
                      setNombre(PAQUET)
                    }}
                    aria-pressed={actif}
                    className={`relative shrink-0 rounded-full border px-4 py-2 font-semibold transition-colors ${
                      actif ? 'border-transparent text-white' : 'border-rule text-muted hover:text-[var(--text)]'
                    }`}
                  >
                    {actif && (
                      <motion.span
                        layoutId="filtre-actif"
                        className="absolute inset-0 -z-10 rounded-full bg-encre dark:bg-rouge"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{t ?? 'Tout'}</span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>

          <div className="mt-6 flex flex-col gap-3 sm:gap-5">
            {visibles.map((p) => (
              <CartePublication key={p.id} pub={p} />
            ))}
            {visibles.length === 0 && (
              <p className="px-4 py-12 text-muted sm:px-0">
                Pas encore de publication dans ce thème.{' '}
                <button type="button" className="font-semibold text-rouge underline" onClick={() => setFiltre(null)}>
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
                <Link to="/agenda" className="font-semibold text-rouge hover:underline">Agenda</Link>
              </div>
              {prochains.length === 0 && (
                <p className="mt-4 border-y border-rule py-4 text-muted">
                  Pas de rendez-vous annoncé pour l’instant. Les prochaines dates seront publiées ici.
                </p>
              )}
              <ol className="mt-4 divide-y divide-[var(--rule)] border-y border-rule empty:hidden">
                {prochains.map((e) => (
                  <li key={e.id} className="flex gap-4 py-4">
                    <div className="w-12 shrink-0 text-center">
                      <div className="font-condensed text-4xl leading-none font-[850] text-rouge">{numeroJour(e.date)}</div>
                      <div className="text-sm text-muted">{formatMoisCourt(e.date)}</div>
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

            <section className="rounded-2xl bg-encre p-6 text-white dark:bg-surface">
              <h2 className="font-condensed text-4xl leading-none font-[850]">Seul on subit, ensemble on agit</h2>
              <p className="mt-3 text-white/80">Adhérer à la CGT, c’est être informé, défendu et ne plus être seul face à l’employeur.</p>
              <Link
                to="/adherer"
                className="mt-5 inline-flex h-11 items-center rounded-full bg-rouge px-5 font-semibold transition-colors hover:bg-rouge-fonce"
              >
                Adhérer
              </Link>
            </section>

            <section>
              <h2 className="font-condensed text-3xl font-[850]">Besoin d’aide ?</h2>
              <p className="mt-2 text-muted">Trouvez l’union locale la plus proche et ses permanences.</p>
              <Link to="/contact" className="mt-3 inline-block font-semibold text-rouge hover:underline">
                Nous trouver et nous écrire
              </Link>
            </section>
          </div>
        </aside>
      </div>
    </main>
  )
}
