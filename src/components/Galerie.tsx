import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Visuel as V } from '../data/types'
import { Visuel } from './Visuel'
import { EASE_SORTIE, INSTANTANE } from '../lib/mouvement'

// Sortie de la visionneuse ou d'une photo : rapide au toucher, immédiate au clavier.
const SORTIE = {
  cache: (clavier: boolean) => ({ opacity: 0, transition: clavier ? INSTANTANE : { duration: 0.12, ease: EASE_SORTIE } }),
}

/** Hauteur / largeur d'une photo (null si inconnue). */
const proportion = (v: V) => (v.largeur && v.hauteur ? v.hauteur / v.largeur : null)

/**
 * Forme du cadre : celle des photos elles-mêmes, entre le format paysage 16:9 et le portrait 4:5.
 * Une photo plus haute ou plus large reste entière, avec un fond flou de chaque côté.
 */
function formeDuCadre(visuels: V[], mesurees: Record<number, number>) {
  const p = visuels.map((v, i) => proportion(v) ?? mesurees[i]).filter((x): x is number => !!x)
  const voulu = p.length ? Math.max(...p) : 3 / 4
  return Math.min(Math.max(voulu, 9 / 16), 5 / 4)
}

/** Galerie du fil : photos entières, glissables au doigt, avec ouverture plein écran. */
export function Galerie({ visuels, id }: { visuels: V[]; id: string }) {
  const piste = useRef<HTMLDivElement>(null)
  const [actif, setActif] = useState(0)
  const [plein, setPlein] = useState<number | null>(null)
  const [mesurees, setMesurees] = useState<Record<number, number>>({})
  const plusieurs = visuels.length > 1

  const onScroll = () => {
    const el = piste.current
    if (el) setActif(Math.round(el.scrollLeft / el.clientWidth))
  }
  const aller = (i: number) => {
    const el = piste.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  // Photos sans dimensions enregistrées : on les mesure une fois chargées.
  useEffect(() => {
    visuels.forEach((v, i) => {
      if (!v.src || proportion(v)) return
      const img = new Image()
      img.onload = () => setMesurees((m) => ({ ...m, [i]: img.naturalHeight / img.naturalWidth }))
      img.src = v.src
    })
  }, [visuels])

  return (
    <div className="group relative bg-encre" id={`galerie-${id}`}>
      <div
        ref={piste}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        style={{ aspectRatio: `1 / ${formeDuCadre(visuels, mesurees)}` }}
      >
        {visuels.map((v, i) => (
          <button
            key={v.src ?? i}
            type="button"
            onClick={() => setPlein(i)}
            className="h-full w-full shrink-0 snap-center"
            aria-label={`Agrandir la photo ${i + 1} : ${v.legende}`}
          >
            <Visuel visuel={v} />
          </button>
        ))}
      </div>

      {plusieurs && (
        <>
          <span className="pointer-events-none absolute top-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-sm font-semibold text-white tabular-nums">
            {actif + 1} / {visuels.length}
          </span>
          {visuels.length <= 12 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
              {visuels.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => aller(i)}
                  aria-label={`Photo ${i + 1} sur ${visuels.length}`}
                  className={`pointer-events-auto h-1.5 rounded-full bg-white shadow transition-[width,opacity] duration-200 ease-sortie ${
                    i === actif ? 'w-6 opacity-100' : 'w-1.5 opacity-60'
                  }`}
                />
              ))}
            </div>
          )}
          <Fleche sens={-1} cache={actif === 0} onClick={() => aller(actif - 1)} />
          <Fleche sens={1} cache={actif === visuels.length - 1} onClick={() => aller(actif + 1)} />
        </>
      )}

      <Visionneuse visuels={visuels} index={plein} changer={setPlein} />
    </div>
  )
}

/** Flèches précédent / suivant, visibles au survol sur ordinateur. */
function Fleche({ sens, cache, onClick }: { sens: -1 | 1; cache: boolean; onClick: () => void }) {
  if (cache) return null
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={sens < 0 ? 'Photo précédente' : 'Photo suivante'}
      className={`absolute top-1/2 hidden size-10 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-encre opacity-0 shadow appui group-hover:opacity-100 focus-visible:opacity-100 sm:grid ${
        sens < 0 ? 'left-3' : 'right-3'
      }`}
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
        <path d={sens < 0 ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
      </svg>
    </button>
  )
}

/** Toutes les photos l'une sous l'autre, entières (page d'une publication). */
export function PhotosEnPile({ visuels }: { visuels: V[] }) {
  const [plein, setPlein] = useState<number | null>(null)
  return (
    <div className="flex flex-col gap-1 bg-surface">
      {visuels.map((v, i) =>
        v.src ? (
          <button
            key={v.src}
            type="button"
            onClick={() => setPlein(i)}
            className="block overflow-hidden bg-[var(--rule)]"
            aria-label={`Agrandir la photo ${i + 1} : ${v.legende}`}
          >
            <img
              src={v.src}
              alt={v.legende}
              width={v.largeur}
              height={v.hauteur}
              loading={i < 2 ? 'eager' : 'lazy'}
              className="block h-auto w-full"
            />
          </button>
        ) : (
          <div key={i} className="aspect-[4/3] overflow-hidden">
            <Visuel visuel={v} />
          </div>
        ),
      )}
      <Visionneuse visuels={visuels} index={plein} changer={setPlein} />
    </div>
  )
}

/** Plein écran : photo entière sur fond noir, glisser ou flèches pour changer. */
function Visionneuse({
  visuels,
  index,
  changer,
}: {
  visuels: V[]
  index: number | null
  changer: (i: number | null) => void
}) {
  const plusieurs = visuels.length > 1
  // Une action au clavier (Échap, flèches) se répète vite : elle change l'écran sans animation.
  const [clavier, setClavier] = useState(false)
  const aller = (i: number | null, auClavier = false) => {
    setClavier(auClavier)
    changer(i)
  }
  const suivante = () => index !== null && aller(Math.min(index + 1, visuels.length - 1))
  const precedente = () => index !== null && aller(Math.max(index - 1, 0))

  useEffect(() => {
    if (index === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') aller(null, true)
      if (e.key === 'ArrowRight') aller(Math.min(index + 1, visuels.length - 1), true)
      if (e.key === 'ArrowLeft') aller(Math.max(index - 1, 0), true)
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps -- aller ne dépend que de changer
  }, [index, visuels.length, changer])

  // Clavier et lecteurs d'écran : le focus entre dans la visionneuse à l'ouverture,
  // y reste (Tab boucle sur ses boutons) et revient à la photo touchée à la fermeture.
  const ouverte = index !== null
  const boite = useRef<HTMLDivElement>(null)
  const fermer = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    if (!ouverte) return
    const avant = document.activeElement as HTMLElement | null
    fermer.current?.focus()
    const piege = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !boite.current) return
      const f = [...boite.current.querySelectorAll<HTMLElement>('button')]
      if (!f.length) return
      const premier = f[0]
      const dernier = f[f.length - 1]
      if (e.shiftKey && document.activeElement === premier) {
        e.preventDefault()
        dernier.focus()
      } else if (!e.shiftKey && document.activeElement === dernier) {
        e.preventDefault()
        premier.focus()
      }
    }
    window.addEventListener('keydown', piege)
    return () => {
      window.removeEventListener('keydown', piege)
      avant?.focus()
    }
  }, [ouverte])

  const v = index === null ? null : visuels[index]

  return (
    <AnimatePresence custom={clavier}>
      {v && index !== null && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          variants={SORTIE}
          custom={clavier}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.2, ease: EASE_SORTIE } }}
          exit="cache"
          role="dialog"
          aria-modal="true"
          aria-label="Photo en plein écran"
          ref={boite}
          // Toucher le fond noir ferme ; toucher la photo ne ferme pas.
          onClick={(e) => e.target === e.currentTarget && aller(null)}
        >
          <div className="flex items-center justify-between p-4 text-white">
            <span className="text-sm text-white/70 tabular-nums">{plusieurs ? `${index + 1} / ${visuels.length}` : ''}</span>
            <button ref={fermer} type="button" onClick={() => aller(null)} className="grid size-11 place-items-center rounded-full" aria-label="Fermer">
              <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
            <AnimatePresence mode="wait" initial={false} custom={clavier}>
              <motion.div
                key={index}
                className="flex size-full items-center justify-center"
                variants={SORTIE}
                custom={clavier}
                // Sortie 120 ms + entrée 150 ms : on reste sous 300 ms ; rien du tout au clavier.
                initial={clavier ? false : { opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1, transition: { duration: 0.15, ease: EASE_SORTIE } }}
                exit="cache"
                drag={plusieurs ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.6}
                // Un petit coup de doigt rapide suffit : on regarde la vitesse, pas seulement la distance.
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60 || info.velocity.x < -400) suivante()
                  else if (info.offset.x > 60 || info.velocity.x > 400) precedente()
                }}
              >
                {v.src ? (
                  <img src={v.src} alt={v.legende} draggable={false} className="max-h-full max-w-full select-none object-contain" />
                ) : (
                  <div className="aspect-[4/3] w-full max-w-4xl overflow-hidden">
                    <Visuel visuel={v} />
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
            {plusieurs && index > 0 && (
              <button type="button" onClick={precedente} aria-label="Photo précédente" className="absolute left-3 hidden size-12 place-items-center rounded-full bg-white/15 text-white appui hover:bg-white/25 sm:grid">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg>
              </button>
            )}
            {plusieurs && index < visuels.length - 1 && (
              <button type="button" onClick={suivante} aria-label="Photo suivante" className="absolute right-3 hidden size-12 place-items-center rounded-full bg-white/15 text-white appui hover:bg-white/25 sm:grid">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
              </button>
            )}
          </div>
          {v.legende && <p className="p-5 text-center text-white/80">{v.legende}</p>}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
