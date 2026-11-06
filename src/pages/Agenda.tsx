import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useEvenements } from '../data/evenements'
import type { Evenement } from '../data/types'
import { Page } from '../components/Page'
import { useReglages } from '../data/reglages'
import { formatJourSemaine, formatMois, numeroJour } from '../lib/format'
import { EASE_SORTIE } from '../lib/mouvement'

/** Date du jour au format AAAA-MM-JJ, en heure locale. */
const aujourdhui = () => new Date().toLocaleDateString('sv-SE')

function parMois(liste: Evenement[]) {
  const groupes = new Map<string, Evenement[]>()
  for (const e of liste) {
    const cle = formatMois(e.date)
    groupes.set(cle, [...(groupes.get(cle) ?? []), e])
  }
  return [...groupes]
}

function LigneEvenement({ e, passe }: { e: Evenement; passe: boolean }) {
  return (
    <li className="grid grid-cols-[4.5rem_1fr] gap-4 py-5 sm:grid-cols-[6rem_1fr_auto] sm:items-start">
      <div
        className={`flex aspect-square flex-col items-center justify-center ${
          passe ? 'bg-[var(--rule)] text-[var(--muted)]' : 'bg-jaune text-encre'
        }`}
      >
        <div className="font-condensed text-5xl leading-[0.85] font-[900] sm:text-6xl">{numeroJour(e.date)}</div>
        <div className="mt-1 text-xs font-semibold first-letter:uppercase sm:text-sm">{formatJourSemaine(e.date)}</div>
      </div>
      <div>
        <p className="text-xl font-semibold leading-snug">{e.titre}</p>
        <p className="mt-1 text-muted">{[e.heure, e.lieu].filter(Boolean).join(', ')}</p>
        {e.description && <p className="mt-2 max-w-[60ch]">{e.description}</p>}
        {e.lienFacebook && (
          <a
            href={e.lienFacebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block font-semibold text-rouge-texte hover:underline"
          >
            {passe ? 'Voir les photos sur Facebook' : 'Voir l’annonce sur Facebook'}
          </a>
        )}
      </div>
      <span className="col-start-2 justify-self-start rounded-full border border-rule px-3 py-1 text-sm font-semibold sm:col-start-auto">
        {e.type}
      </span>
    </li>
  )
}

function ListeParMois({ liste, passe }: { liste: Evenement[]; passe: boolean }) {
  return (
    <div className="flex flex-col gap-10">
      {parMois(liste).map(([mois, groupe]) => (
        <section key={mois} aria-label={mois}>
          <h3 className="font-condensed text-3xl font-[850] first-letter:uppercase">{mois}</h3>
          <ol className="mt-3 divide-y divide-[var(--rule)] border-y border-rule">
            {groupe.map((e) => (
              <LigneEvenement key={e.id} e={e} passe={passe} />
            ))}
          </ol>
        </section>
      ))}
    </div>
  )
}

export function Agenda() {
  const [voirPasses, setVoirPasses] = useState(true)
  const evenements = useEvenements()
  const SITE = useReglages()
  const jour = aujourdhui()
  const aVenir = evenements.filter((e) => e.date >= jour).sort((a, b) => a.date.localeCompare(b.date))
  const passes = evenements.filter((e) => e.date < jour).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <Page titre="Agenda" intro={SITE.agendaIntro}>
      <section aria-labelledby="titre-a-venir">
        <h2 id="titre-a-venir" className="font-condensed text-4xl font-[850]">À venir</h2>
        {aVenir.length > 0 ? (
          <div className="mt-6">
            <ListeParMois liste={aVenir} passe={false} />
          </div>
        ) : (
          <div className="mt-4 border-t-4 border-[var(--text)] bg-surface p-6 sm:p-8">
            <p className="text-xl font-semibold">Pas de rendez-vous annoncé pour l’instant.</p>
            <p className="mt-2 max-w-[56ch] text-muted">
              Les prochaines dates seront publiées ici dès qu’elles seront fixées. En attendant, suivez l’actualité de l’UD.
            </p>
            <a
              href={SITE.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex h-12 items-center rounded-full bg-rouge px-6 font-semibold text-white appui hover:bg-rouge-fonce"
            >
              Suivre l’UD sur Facebook
            </a>
          </div>
        )}
      </section>

      {passes.length > 0 && (
        <section aria-labelledby="titre-passes" className="mt-16">
          <div className="flex items-baseline justify-between gap-4">
            <h2 id="titre-passes" className="font-condensed text-4xl font-[850]">Ils ont eu lieu</h2>
            <button
              type="button"
              onClick={() => setVoirPasses((v) => !v)}
              aria-expanded={voirPasses}
              aria-controls="liste-passes"
              className="font-semibold text-rouge-texte hover:underline"
            >
              {voirPasses ? 'Masquer' : 'Afficher'}
            </button>
          </div>
          <AnimatePresence initial={false}>
            {voirPasses && (
              <motion.div
                id="liste-passes"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1, transition: { duration: 0.28, ease: EASE_SORTIE } }}
                // Replier va plus vite que déplier : le site répond, l'utilisateur n'attend pas.
                exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: EASE_SORTIE } }}
                className="overflow-hidden"
              >
                <div className="pt-6">
                  <ListeParMois liste={passes} passe />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      )}
    </Page>
  )
}
