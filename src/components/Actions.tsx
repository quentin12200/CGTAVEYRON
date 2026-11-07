import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE_SORTIE } from '../lib/mouvement'
import { aSoutenu, changerSoutien, useTotalSoutiens } from '../data/soutiens'

const cle = (id: string) => `reaction:${id}`

function lire(id: string) {
  try {
    return localStorage.getItem(cle(id)) === '1'
  } catch {
    return false
  }
}

function memoriser(id: string, fait: boolean) {
  try {
    if (fait) localStorage.setItem(cle(id), '1')
    else localStorage.removeItem(cle(id))
  } catch {
    /* stockage indisponible : sans conséquence, Firestore fait foi */
  }
}

/**
 * Bouton « ✊ Je soutiens » avec compteur partagé (src/data/soutiens.ts).
 * Le clic répond tout de suite ; si l'enregistrement échoue, le bouton revient en arrière.
 */
export function Reaction({ id }: { id: string }) {
  const [fait, setFait] = useState(() => lire(id))
  const [rafale, setRafale] = useState(0)
  const [enCours, setEnCours] = useState(false)
  const totalServeur = useTotalSoutiens(id)
  // Écart entre le clic et la réponse du serveur, pour afficher le bon nombre tout de suite.
  const [ecart, setEcart] = useState(0)
  const total = Math.max(0, totalServeur + ecart)

  // Rattrape l'état réel si le stockage local est vide ou faux (autre onglet, autre appareil).
  useEffect(() => {
    let actif = true
    void aSoutenu(id).then((reel) => {
      if (actif && reel !== null) {
        setFait(reel)
        memoriser(id, reel)
      }
    })
    return () => {
      actif = false
    }
  }, [id])

  // Quand le serveur a pris en compte le clic, on retire l'écart provisoire.
  useEffect(() => {
    setEcart(0)
  }, [totalServeur])

  const basculer = async () => {
    if (enCours) return
    const suivant = !fait
    setFait(suivant)
    setEcart((e) => e + (suivant ? 1 : -1))
    if (suivant) setRafale((n) => n + 1)
    memoriser(id, suivant)
    setEnCours(true)
    try {
      await changerSoutien(id, suivant)
    } catch (err) {
      console.warn('Soutien non enregistré :', err)
      setFait(!suivant)
      setEcart(0)
      memoriser(id, !suivant)
    } finally {
      setEnCours(false)
    }
  }

  return (
    <button
      type="button"
      onClick={basculer}
      aria-pressed={fait}
      aria-label={`${fait ? 'Solidaire' : 'Je soutiens'}${total ? ` : ${total} soutien${total > 1 ? 's' : ''}` : ''}`}
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
      <span aria-hidden="true">{fait ? 'Solidaire' : 'Je soutiens'}</span>
      {total > 0 && (
        <span aria-hidden="true" className={`tabular-nums ${fait ? 'text-white/85' : 'text-muted'}`}>
          {/* Le nombre change par un fondu court, légèrement flouté : un seul changement à l'œil. */}
          <motion.span
            key={total}
            className="inline-block"
            initial={{ opacity: 0, filter: 'blur(2px)' }}
            animate={{ opacity: 1, filter: 'blur(0px)' }}
            transition={{ duration: 0.15, ease: EASE_SORTIE }}
          >
            {total}
          </motion.span>
        </span>
      )}
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
