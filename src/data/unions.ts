// Unions locales (page Contact) : celles de demo.ts, complétées depuis /admin (collection Firestore « unionsLocales »).
import type { UnionLocale } from './types'
import { unionsLocales } from './demo'
import { listeEnDirect } from './enDirect'

// L'UD d'abord, puis les unions locales par ordre alphabétique.
const liste = listeEnDirect<UnionLocale>('unionsLocales', unionsLocales, (a, b) =>
  a.id === 'ud' ? -1 : b.id === 'ud' ? 1 : a.nom.localeCompare(b.nom, 'fr'),
)

export const useUnionsLocales = liste.useVisibles
export const useToutesUnionsLocales = liste.useTous
