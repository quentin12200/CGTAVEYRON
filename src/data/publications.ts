// Les publications du site : celles importées de Facebook (facebook.ts),
// complétées et corrigées par celles enregistrées dans Firestore depuis /admin.
// Une publication Firestore remplace la publication importée qui a le même identifiant.
import { useSyncExternalStore } from 'react'
import type { Publication } from './types'
import { publicationsFacebook } from './facebook'

let enLigne = new Map<string, Publication>()
let toutes: Publication[] = calculer()
let visibles: Publication[] = toutes.filter((p) => !p.masque)
const abonnes = new Set<() => void>()
let demarre = false

function calculer(): Publication[] {
  const parId = new Map<string, Publication>()
  for (const p of publicationsFacebook) parId.set(p.id, p)
  for (const [id, p] of enLigne) parId.set(id, { ...p, id })
  return [...parId.values()].sort((a, b) => b.date.localeCompare(a.date))
}

function prevenir() {
  toutes = calculer()
  visibles = toutes.filter((p) => !p.masque)
  for (const f of abonnes) f()
}

/** Écoute Firestore en direct (une seule fois pour tout le site). */
function demarrer() {
  if (demarre) return
  demarre = true
  void import('../lib/firebase').then(async ({ services }) => {
    const s = await services()
    if (!s) return
    const { collection, onSnapshot } = await import('firebase/firestore')
    onSnapshot(
      collection(s.db, 'publications'),
      (snap) => {
        enLigne = new Map(snap.docs.map((d) => [d.id, d.data() as Publication]))
        prevenir()
      },
      (err) => console.warn('Publications en ligne indisponibles :', err.message),
    )
  })
}

function abonner(f: () => void) {
  demarrer()
  abonnes.add(f)
  return () => {
    abonnes.delete(f)
  }
}

/** Publications affichées sur le site, de la plus récente à la plus ancienne. */
export function usePublications(): Publication[] {
  return useSyncExternalStore(abonner, () => visibles)
}

/** Toutes les publications, y compris celles retirées du site (pour l'administration). */
export function useToutesPublications(): Publication[] {
  return useSyncExternalStore(abonner, () => toutes)
}
