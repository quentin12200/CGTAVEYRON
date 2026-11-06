// Les publications du site : celles importées de Facebook (facebook.ts),
// complétées et corrigées par celles enregistrées dans Firestore depuis /admin.
import type { Publication } from './types'
import { publicationsFacebook } from './facebook'
import { listeEnDirect } from './enDirect'

const liste = listeEnDirect<Publication>('publications', publicationsFacebook, (a, b) => b.date.localeCompare(a.date))

/** Publications affichées sur le site, de la plus récente à la plus ancienne. */
export const usePublications = liste.useVisibles
/** Toutes les publications, y compris celles retirées du site (pour l'administration). */
export const useToutesPublications = liste.useTous
