// L'agenda du site : rendez-vous de demo.ts, complétés et corrigés depuis /admin (collection Firestore « evenements »).
import type { Evenement } from './types'
import { evenements } from './demo'
import { listeEnDirect } from './enDirect'

const liste = listeEnDirect<Evenement>('evenements', evenements, (a, b) => a.date.localeCompare(b.date))

/** Rendez-vous affichés sur le site, du plus ancien au plus récent. */
export const useEvenements = liste.useVisibles
/** Tous les rendez-vous, y compris ceux retirés du site (pour l'administration). */
export const useTousEvenements = liste.useTous
