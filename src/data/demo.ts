// Contenu du site en attendant Firestore (étape 2 de la feuille de route).
// Publications : vraies publications de la page Facebook de l'UD (voir facebook.ts).
import type { Evenement, UnionLocale } from './types'
import { publicationsFacebook } from './facebook'

export const DEMO = false

export const publications = publicationsFacebook

// Rendez-vous réels uniquement : pas de date inventée.
export const evenements: Evenement[] = [
  { id: 'mobilisation-5-novembre', titre: 'Journée nationale de grève et de manifestations', date: '2026-11-05', heure: '14 h 30', lieu: 'Rodez, jardin public', type: 'Manifestation' },
]

// Coordonnées à compléter : rien n'est inventé ici.
export const unionsLocales: UnionLocale[] = [
  { id: 'ud', nom: 'Union départementale CGT de l’Aveyron' },
  { id: 'villefranche', nom: 'Union locale de Villefranche-de-Rouergue' },
]
