import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_SORTIE } from '../lib/mouvement'

const cle = (id: string) => `reaction:${id}`

function lire(id: string) {
  try {
    return localStorage.getItem(cle(id)) === '1'
  } catch {
    return false
  }
}

/**
 * Réaction anonyme ✊. Pour l'instant mémorisée dans le navigateur seulement ;
 * le compteur partagé arrive avec Firestore (étape 5).
 */
export function Reaction({ id }: { id: string }) {
  const [fait, setFait] = useState(() => lire(id))
  const [rafale, setRafale] = useState(0)

  const basculer = () => {
    const suivant = !fait
    setFait(suivant)
    if (suivant) setRafale((n) => n + 1)
    try {
      if (suivant) localStorage.setItem(cle(id), '1')
      else localStorage.removeItem(cle(id))
    } catch {
      /* stockage indisponible : la réaction reste visuelle */
    }
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-pressed={fait}
      className={`relative flex h-10 shrink-0 items-center whitespace-nowrap gap-2 rounded-full px-3 font-semibold appui ${
        fait ? 'bg-rouge text-white' : 'bg-[var(--rule)]/60 hover:bg-[var(--rule)]'
      }`}
    >
      <motion.span
        key={rafale}
        // Petit moment de joie, rare : le poing rebondit un peu, sans partir de rien.
        initial={rafale ? { scale: 0.6, rotate: -14 } : false}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', duration: 0.4, bounce: 0.45 }}
        aria-hidden="true"
        className="text-lg leading-none"
      >
        ✊
      </motion.span>
      {fait ? 'Solidaire' : 'Je soutiens'}
      <AnimatePresence>
        {fait && rafale > 0 && (
          <motion.span
            key={`plus-${rafale}`}
            className="pointer-events-none absolute -top-2 left-4 text-sm font-bold text-rouge-texte"
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -28 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: EASE_SORTIE }}
            aria-hidden="true"
          >
            +1
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}

/** Partage natif sur téléphone ; sinon copie du lien. */
export function Partager({ titre, chemin }: { titre: string; chemin: string }) {
  const [copie, setCopie] = useState(false)

  const partager = async () => {
    const url = new URL(chemin, window.location.origin).toString()
    if (navigator.share) {
      try {
        await navigator.share({ title: titre, url })
        return
      } catch {
        /* partage annulé : on ne fait rien */
        return
      }
    }
    await navigator.clipboard.writeText(url)
    setCopie(true)
    setTimeout(() => setCopie(false), 2000)
  }

  return (
    <button
      type="button"
      onClick={partager}
      className="flex h-10 shrink-0 items-center whitespace-nowrap gap-2 rounded-full px-3 font-semibold appui hover:bg-[var(--rule)]/60"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 15V3M7 8l5-5 5 5M5 13v6a2 2 0 002 2h10a2 2 0 002-2v-6" />
      </svg>
      <span aria-live="polite" className={copie ? '' : 'max-[400px]:sr-only'}>
        {/* Un léger flou pendant le fondu fond les deux libellés en un seul changement. */}
        <motion.span
          key={copie ? 'copie' : 'partager'}
          className="inline-block"
          initial={{ opacity: 0, filter: 'blur(2px)' }}
          animate={{ opacity: 1, filter: 'blur(0px)' }}
          transition={{ duration: 0.15, ease: EASE_SORTIE }}
        >
          {copie ? 'Lien copié' : 'Partager'}
        </motion.span>
      </span>
    </button>
  )
}
