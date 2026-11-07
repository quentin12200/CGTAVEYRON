import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'motion/react'
import type { Publication } from '../data/types'
import { formatJourMois, formatJourSemaine, lireDate } from '../lib/format'
import { EASE_DEPLACEMENT, EASE_SORTIE } from '../lib/mouvement'

// L'entrée de la banderole ne se joue qu'à la première arrivée sur le site :
// en revenant à l'accueil, on veut le contenu tout de suite, pas le spectacle une deuxième fois.
let dejaJouee = false

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
  const [jouer] = useState(() => !reduit && !dejaJouee)
  useEffect(() => {
    dejaJouee = true
  }, [])
  const compte = useCompteARebours(pub.dateEvenement)
  const mots = pub.titre.split(' ')
  const photos = pub.visuels?.filter((v) => v.src) ?? []
  const photo = photos[0]

  return (
    // La banderole entière se déroule de gauche à droite, comme un tissu qu'on déploie (une fois par visite).
    <motion.section
      aria-label="À la une"
      className="relative isolate overflow-hidden bg-rouge text-white"
      initial={jouer ? { clipPath: 'inset(0 100% 0 0)' } : false}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      transition={{ duration: 0.7, ease: EASE_DEPLACEMENT }}
    >
      {/* Le pli sombre et le reflet clair glissent lentement, en continu : du vent dans la banderole. */}
      <div aria-hidden="true" className="vent absolute inset-y-0 -inset-x-[15%] -z-10">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="size-full">
          <path d="M-5 108 L105 -8" stroke="rgba(0,0,0,.12)" strokeWidth="22" />
          <path d="M20 108 L130 -8" stroke="rgba(255,255,255,.07)" strokeWidth="10" />
        </svg>
      </div>

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
                initial={jouer ? { y: '105%' } : false}
                animate={{ y: 0 }}
                // 40 ms entre les mots, plafonné : un long titre ne fait pas attendre la suite.
                transition={{ delay: 0.45 + Math.min(i, 8) * 0.05, duration: 0.5, ease: EASE_SORTIE }}
              >
                {m}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={jouer ? { opacity: 0, y: 12 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75, duration: 0.4, ease: EASE_SORTIE }}
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
              <a href={pub.lienFacebook} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex h-12 items-center rounded-full bg-white px-6 font-semibold text-rouge appui">
                Voir sur Facebook
              </a>
            ) : (
              <Link to={`/publication/${pub.id}`} className="mt-4 inline-flex h-12 items-center rounded-full bg-white px-6 font-semibold text-rouge appui">
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
            // La photo tombe et se pose, légèrement penchée, comme un tirage qu'on épingle.
            initial={jouer ? { opacity: 0, y: -24, rotate: 4 } : false}
            animate={{ opacity: 1, y: 0, rotate: -1.5 }}
            transition={{ delay: 0.7, type: 'spring', duration: 0.6, bounce: 0.25 }}
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
    </motion.section>
  )
}
