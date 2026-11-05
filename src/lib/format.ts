const jourMois = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long' })
const jourMoisAnnee = new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
const mois = new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
const moisCourt = new Intl.DateTimeFormat('fr-FR', { month: 'short' })
const jourSemaine = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' })

/** Lit une date ISO « AAAA-MM-JJ » en heure locale (évite le décalage d'un jour). */
export function lireDate(iso: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    const [a, m, j] = iso.split('-').map(Number)
    return new Date(a, m - 1, j)
  }
  return new Date(iso)
}

/** « il y a 2 jours », « hier », ou la date si c'est plus ancien. */
export function dateRelative(iso: string, maintenant = new Date()): string {
  const d = lireDate(iso)
  const jours = Math.round((startOfDay(maintenant).getTime() - startOfDay(d).getTime()) / 864e5)
  if (jours <= 0) return 'Aujourd’hui'
  if (jours === 1) return 'Hier'
  if (jours < 7) return `Il y a ${jours} jours`
  return d.getFullYear() === maintenant.getFullYear() ? jourMois.format(d) : jourMoisAnnee.format(d)
}

export const formatJourMois = (iso: string) => jourMois.format(lireDate(iso))
export const formatMois = (iso: string) => mois.format(lireDate(iso))
export const formatMoisCourt = (iso: string) => moisCourt.format(lireDate(iso)).replace('.', '')
export const formatJourSemaine = (iso: string) => jourSemaine.format(lireDate(iso))
export const numeroJour = (iso: string) => lireDate(iso).getDate()

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}
