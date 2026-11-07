// Une liste du site, complétée en direct par une collection Firestore modifiée depuis /admin.
// Un document Firestore remplace l'élément de base qui a le même identifiant ;
// `masque: true` le retire du site sans l'effacer.
import { useSyncExternalStore } from 'react'

type Element = { id: string; masque?: boolean }

export function listeEnDirect<T extends Element>(collection: string, base: T[], tri: (a: T, b: T) => number) {
  let enLigne = new Map<string, T>()
  let toutes: T[] = calculer()
  let visibles: T[] = toutes.filter((x) => !x.masque)
  const abonnes = new Set<() => void>()
  let demarre = false
  // « Prêt » : la première réponse de Firestore est arrivée (ou Firebase est absent, en erreur,
  // ou trop lent). Avant, la liste de base peut encore être démentie par Firestore.
  let pret = false
  const devenirPret = () => {
    if (pret) return
    pret = true
    for (const f of abonnes) f()
  }

  function calculer(): T[] {
    const parId = new Map<string, T>()
    for (const x of base) parId.set(x.id, x)
    for (const [id, x] of enLigne) parId.set(id, { ...x, id })
    return [...parId.values()].sort(tri)
  }

  function demarrer() {
    if (demarre) return
    demarre = true
    setTimeout(devenirPret, 2500)
    void import('../lib/firebase').then(async ({ services }) => {
      const s = await services()
      if (!s) return devenirPret()
      const { collection: col, onSnapshot } = await import('firebase/firestore')
      onSnapshot(
        col(s.db, collection),
        (snap) => {
          enLigne = new Map(snap.docs.map((d) => [d.id, d.data() as T]))
          toutes = calculer()
          visibles = toutes.filter((x) => !x.masque)
          pret = true
          for (const f of abonnes) f()
        },
        (err) => {
          console.warn(`« ${collection} » indisponible en ligne :`, err.message)
          devenirPret()
        },
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

  return {
    /** Éléments affichés sur le site. */
    useVisibles: () => useSyncExternalStore(abonner, () => visibles),
    /** Tous les éléments, y compris ceux retirés du site (administration). */
    useTous: () => useSyncExternalStore(abonner, () => toutes),
    /** Vrai quand la liste ne risque plus d'être démentie par Firestore. */
    usePret: () => useSyncExternalStore(abonner, () => pret),
  }
}
