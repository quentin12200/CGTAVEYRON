import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import type { Publication } from '../data/types'
import { formatJourMois, formatJourSemaine, lireDate } from '../lib/format'

function useCompteARebours(cible?: string) {
  const [maintenant, setMaintenant] = useState(() => Date.now())
  useEffect(() => {
    if (!cible) return
    const t = setInterval(() => setMaintenant(Date.now()), 30_000)
    return () => clearInterval(t)
  }, [cible])
  if (!cible) return null
  const reste = lireDate(cible).getTime() - maintenant
  if (reste <= 0) return null
  return {
    jours: Math.floor(reste / 864e5),
    heures: Math.floor((reste % 864e5) / 36e5),
    minutes: Math.floor((reste % 36e5) / 6e4),
  }
}

/**
 * La publication épinglée, en tête du site, comme une banderole qu'on déploie.
 * C'est le seul grand mouvement automatique du site.
 */
export function Banderole({ pub }: { pub: Publication }) {
  const reduit = useReducedMotion()
  const compte = useCompteARebours(pub.dateEvenement)
  const mots = pub.titre.split(' ')

  return (
    <section aria-label="À la une" className="relative isolate overflow-hidden bg-rouge text-white">
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        initial={reduit ? false : { clipPath: 'inset(0 100% 0 0)' }}
        animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 0.9, ease: [0.7, 0, 0.2, 1] }}
      >
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          <path d="M-5 108 L105 -8" stroke="rgba(0,0,0,.12)" strokeWidth="22" />
        </svg>
      </motion.div>

      <div className="mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16">
        <p className="flex items-center gap-2 font-semibold text-white/85">
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-white/70" />
            <span className="relative inline-flex size-2.5 rounded-full bg-white" />
          </span>
          À la une
        </p>

        <h1 className="mt-4 max-w-5xl font-condensed text-[clamp(2.4rem,10.5vw,8.5rem)] leading-[0.86] font-[900] hyphens-auto sm:hyphens-none">
          {mots.map((m, i) => (
            <span key={i} className="mr-[0.2em] inline-block overflow-hidden pb-[0.06em] align-bottom last:mr-0">
              <motion.span
                className="inline-block"
                initial={reduit ? false : { y: '105%' }}
                animate={{ y: 0 }}
                transition={{ delay: 0.35 + i * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {m}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={reduit ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 + mots.length * 0.06 + 0.1, duration: 0.5 }}
          className="mt-8 flex flex-col gap-8 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="text-lg">
            {pub.dateEvenement && (
              <p className="font-semibold">
                {formatJourSemaine(pub.dateEvenement)} {formatJourMois(pub.dateEvenement)}
                {pub.lieu && <span className="font-normal text-white/85">, {pub.lieu}</span>}
              </p>
            )}
            {pub.lienFacebook ? (
              <a href={pub.lienFacebook} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-12 items-center rounded-full bg-white px-6 font-semibold text-rouge transition-transform hover:scale-[1.03] active:scale-[0.98]">
                Voir sur Facebook
              </a>
            ) : (
              <Link to={`/publication/${pub.id}`} className="mt-4 inline-flex h-12 items-center rounded-full bg-white px-6 font-semibold text-rouge transition-transform hover:scale-[1.03] active:scale-[0.98]">
                Lire la suite
              </Link>
            )}
          </div>

          {compte && (
            <dl className="flex gap-6 sm:gap-8" aria-label="Temps restant avant l’événement">
              {[
                ['jours', compte.jours],
                ['heures', compte.heures],
                ['minutes', compte.minutes],
              ].map(([label, valeur]) => (
                <div key={label as string} className="flex flex-col-reverse">
                  <dt className="text-sm text-white/80">{label}</dt>
                  <dd className="font-condensed text-6xl leading-none font-[850] tabular-nums">{valeur}</dd>
                </div>
              ))}
            </dl>
          )}
        </motion.div>
      </div>
    </section>
  )
}
