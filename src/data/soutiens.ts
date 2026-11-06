// Bouton « ✊ Je soutiens » partagé : compteur commun dans Firestore.
//   soutiens/{publication}            { total }      lisible par tous
//   soutiens/{publication}/par/{uid}  {}             « j'ai soutenu », lisible par son auteur seul
// Un visiteur reçoit une identité anonyme Firebase (sans compte ni e-mail) à son premier soutien ;
// les règles (firestore.rules) n'autorisent qu'un soutien par identité et par publication.
import { useSyncExternalStore } from 'react'

let totaux = new Map<string, number>()
const abonnes = new Set<() => void>()
let demarre = false

function prevenir() {
  for (const f of abonnes) f()
}

function demarrer() {
  if (demarre) return
  demarre = true
  void import('../lib/firebase').then(async ({ services }) => {
    const s = await services()
    if (!s) return
    const { collection, onSnapshot } = await import('firebase/firestore')
    onSnapshot(
      collection(s.db, 'soutiens'),
      (snap) => {
        totaux = new Map(snap.docs.map((d) => [d.id, Math.max(0, Number(d.data().total) || 0)]))
        prevenir()
      },
      (err) => console.warn('Soutiens indisponibles :', err.message),
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

/** Nombre de soutiens d'une publication, à jour en direct (0 si Firebase est absent). */
export function useTotalSoutiens(id: string): number {
  return useSyncExternalStore(abonner, () => totaux.get(id) ?? 0)
}

/** Ajoute ou retire le soutien du visiteur. Lève une erreur si l'enregistrement échoue. */
export async function changerSoutien(id: string, soutenir: boolean): Promise<void> {
  const { services } = await import('../lib/firebase')
  const s = await services()
  if (!s) throw new Error('Firebase indisponible')
  const { signInAnonymously } = await import('firebase/auth')
  await s.auth.authStateReady()
  const uid = s.auth.currentUser?.uid ?? (await signInAnonymously(s.auth)).user.uid
  const { doc, getDoc, increment, writeBatch } = await import('firebase/firestore')
  const compteur = doc(s.db, 'soutiens', id)
  const moi = doc(s.db, 'soutiens', id, 'par', uid)
  // L'état réel du visiteur fait foi (il a pu soutenir depuis un autre onglet).
  const dejaFait = (await getDoc(moi)).exists()
  if (dejaFait === soutenir) return
  const lot = writeBatch(s.db)
  if (soutenir) {
    lot.set(moi, {})
    lot.set(compteur, { total: increment(1) }, { merge: true })
  } else {
    lot.delete(moi)
    lot.set(compteur, { total: increment(-1) }, { merge: true })
  }
  await lot.commit()
}

/** Le visiteur a-t-il déjà soutenu cette publication ? (null si on ne peut pas le savoir) */
export async function aSoutenu(id: string): Promise<boolean | null> {
  try {
    const { services } = await import('../lib/firebase')
    const s = await services()
    if (!s) return null
    await s.auth.authStateReady()
    const uid = s.auth.currentUser?.uid
    if (!uid) return false
    const { doc, getDoc } = await import('firebase/firestore')
    return (await getDoc(doc(s.db, 'soutiens', id, 'par', uid))).exists()
  } catch {
    return null
  }
}
