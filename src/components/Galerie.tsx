import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Visuel as V } from '../data/types'
import { Visuel } from './Visuel'

/** Galerie glissable au doigt, avec ouverture plein écran. */
export function Galerie({ visuels, id }: { visuels: V[]; id: string }) {
  const piste = useRef<HTMLDivElement>(null)
  const [actif, setActif] = useState(0)
  const [plein, setPlein] = useState<number | null>(null)

  const onScroll = () => {
    const el = piste.current
    if (el) setActif(Math.round(el.scrollLeft / el.clientWidth))
  }

  const aller = (i: number) => {
    const el = piste.current
    if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    if (plein === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPlein(null)
      if (e.key === 'ArrowRight') setPlein((p) => (p === null ? p : Math.min(p + 1, visuels.length - 1)))
      if (e.key === 'ArrowLeft') setPlein((p) => (p === null ? p : Math.max(p - 1, 0)))
    }
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [plein, visuels.length])

  const plusieurs = visuels.length > 1

  return (
    <div className="relative">
      <div
        ref={piste}
        onScroll={onScroll}
        className="flex snap-x snap-mandatory overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {visuels.map((v, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setPlein(i)}
            className="aspect-[4/3] w-full shrink-0 snap-center overflow-hidden"
            aria-label={`Agrandir : ${v.legende}`}
          >
            <motion.div layoutId={`${id}-${i}`} className="size-full">
              <Visuel visuel={v} />
            </motion.div>
          </button>
        ))}
      </div>

      {plusieurs && (
        <div className="pointer-events-none absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
          {visuels.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => aller(i)}
              aria-label={`Image ${i + 1} sur ${visuels.length}`}
              className={`pointer-events-auto h-1.5 rounded-full bg-white shadow transition-all duration-300 ${
                i === actif ? 'w-6 opacity-100' : 'w-1.5 opacity-60'
              }`}
            />
          ))}
        </div>
      )}

      <AnimatePresence>
        {plein !== null && (
          <motion.div
            className="fixed inset-0 z-50 flex flex-col bg-black/92"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Image en plein écran"
            onClick={() => setPlein(null)}
          >
            <div className="flex items-center justify-between p-4 text-white">
              <span className="text-sm text-white/70">
                {plusieurs ? `${plein + 1} / ${visuels.length}` : ''}
              </span>
              <button type="button" className="grid size-11 place-items-center rounded-full" aria-label="Fermer">
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <div className="flex flex-1 items-center justify-center p-4" onClick={(e) => e.stopPropagation()}>
              <motion.div
                layoutId={`${id}-${plein}`}
                className="aspect-[4/3] w-full max-w-4xl overflow-hidden rounded-xl"
                drag={plusieurs ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={(_, info) => {
                  if (info.offset.x < -60) setPlein((p) => Math.min((p ?? 0) + 1, visuels.length - 1))
                  if (info.offset.x > 60) setPlein((p) => Math.max((p ?? 0) - 1, 0))
                }}
              >
                <Visuel visuel={visuels[plein]} />
              </motion.div>
            </div>
            <p className="p-6 text-center text-white/80">{visuels[plein].legende}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
