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
  const photos = pub.visuels?.filter((v) => v.src) ?? []
  const photo = photos[0]

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

      <div
        className={`mx-auto max-w-6xl px-4 pt-10 pb-12 sm:px-6 sm:pt-14 sm:pb-16 ${
          photo ? 'lg:grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] lg:items-center lg:gap-14' : ''
        }`}
      >
        <div>
        <p className="inline-block bg-jaune px-2.5 py-1 text-sm font-bold text-encre">À la une</p>

        <h1
          className={`mt-5 max-w-5xl font-condensed text-[clamp(2.3rem,10vw,8rem)] leading-[0.8] font-[900] uppercase hyphens-auto sm:hyphens-none ${
            photo ? 'lg:text-[clamp(3.25rem,5.6vw,6rem)]' : ''
          }`}
        >
          {mots.map((m, i) => (
            <span key={i} className="mr-[0.2em] inline-block overflow-hidden pt-[0.12em] pb-[0.04em] align-bottom last:mr-0">
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

        {photo && (
          // La photo de la publication, entière (jamais recadrée), comme un tirage épinglé sur la banderole.
          <motion.div
            initial={reduit ? false : { opacity: 0, y: 16, rotate: 0 }}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ delay: 0.45 + mots.length * 0.06, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 lg:mt-0"
          >
            <Link
              to={`/publication/${pub.id}`}
              className="relative block bg-white p-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,.45)] sm:p-2"
              aria-label={`Voir les ${photos.length > 1 ? `${photos.length} photos` : 'photos'} : ${pub.titre}`}
            >
              <img
                src={photo.src}
                alt={photo.legende}
                width={photo.largeur}
                height={photo.hauteur}
                className="mx-auto block h-auto max-h-[70vh] w-auto max-w-full"
              />
              {photos.length > 1 && (
                <span className="absolute right-3 bottom-3 rounded-full bg-black/65 px-3 py-1 text-sm font-semibold tabular-nums sm:right-4 sm:bottom-4">
                  {photos.length} photos
                </span>
              )}
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}
