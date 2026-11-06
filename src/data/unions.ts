// Unions locales (page Contact) : celles de demo.ts, complétées depuis /admin (collection Firestore « unionsLocales »).
import type { UnionLocale } from './types'
import { unionsLocales } from './demo'
import { listeEnDirect } from './enDirect'

// L'UD d'abord, puis les unions locales par ville (« Union locale de / d’ » ignoré pour le tri).
const ville = (u: UnionLocale) => u.nom.replace(/^union locale (de |d[’']\s?)?/i, '')
const liste = listeEnDirect<UnionLocale>('unionsLocales', unionsLocales, (a, b) =>
  a.id === 'ud' ? -1 : b.id === 'ud' ? 1 : ville(a).localeCompare(ville(b), 'fr'),
)

export const useUnionsLocales = liste.useVisibles
export const useToutesUnionsLocales = liste.useTous
