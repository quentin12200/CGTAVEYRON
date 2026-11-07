// Agenda au format iCalendar (.ics) : un rendez-vous ou tout l'agenda, lisible par les calendriers
// des téléphones (Google Agenda, Apple Calendrier, Outlook). Sans dépendance au navigateur :
// sert à la fois au bouton « Ajouter à mon agenda » et au fichier public agenda.ics.
import type { Evenement } from '../data/types'

const SITE = 'https://cgtaveyron.web.app'

/** « 14 h 30 », « 14h30 », « 14:30 », « 9 h » → [14, 30] ; sinon null. */
export function lireHeure(heure?: string): [number, number] | null {
  const m = heure?.match(/(\d{1,2})\s*(?:h|:)\s*(\d{2})?/i)
  if (!m) return null
  const h = Number(m[1])
  const min = Number(m[2] ?? 0)
  return h < 24 && min < 60 ? [h, min] : null
}

/** Instant UTC d'une heure de Paris (gère l'heure d'été). */
function parisVersUtc(a: number, mois: number, j: number, h: number, min: number): Date {
  const suppose = Date.UTC(a, mois - 1, j, h, min)
  const vu = (fuseau: string) => new Date(new Date(suppose).toLocaleString('en-US', { timeZone: fuseau })).getTime()
  return new Date(suppose - (vu('Europe/Paris') - vu('UTC')))
}

const deuxChiffres = (n: number) => String(n).padStart(2, '0')
const enUtc = (d: Date) =>
  `${d.getUTCFullYear()}${deuxChiffres(d.getUTCMonth() + 1)}${deuxChiffres(d.getUTCDate())}T${deuxChiffres(d.getUTCHours())}${deuxChiffres(d.getUTCMinutes())}00Z`
const jour = (a: number, m: number, j: number) => `${a}${deuxChiffres(m)}${deuxChiffres(j)}`

/** Échappement iCalendar (virgules, points-virgules, retours à la ligne). */
const echapper = (s: string) => s.replace(/\\/g, '\\\\').replace(/;/g, '\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

/** Lignes de plus de 75 octets repliées, comme l'exige la norme. */
function replier(ligne: string): string {
  const morceaux: string[] = []
  let courant = ''
  for (const c of ligne) {
    if (new TextEncoder().encode(courant + c).length > 73) {
      morceaux.push(courant)
      courant = ' ' + c
    } else courant += c
  }
  morceaux.push(courant)
  return morceaux.join('\r\n')
}

function vevent(e: Evenement): string[] {
  const [a, m, j] = e.date.split('-').map(Number)
  const h = lireHeure(e.heure)
  const lignes = [`UID:${e.id}@cgtaveyron.web.app`, `DTSTAMP:${enUtc(parisVersUtc(a, m, j, 0, 0))}`]
  if (h) {
    const debut = parisVersUtc(a, m, j, h[0], h[1])
    lignes.push(`DTSTART:${enUtc(debut)}`, `DTEND:${enUtc(new Date(debut.getTime() + 2 * 3600e3))}`)
  } else {
    // Sans heure connue : rendez-vous sur la journée.
    const lendemain = new Date(Date.UTC(a, m - 1, j + 1))
    lignes.push(`DTSTART;VALUE=DATE:${jour(a, m, j)}`, `DTEND;VALUE=DATE:${jour(lendemain.getUTCFullYear(), lendemain.getUTCMonth() + 1, lendemain.getUTCDate())}`)
  }
  lignes.push(`SUMMARY:${echapper(`${e.titre} (CGT Aveyron)`)}`)
  if (e.lieu) lignes.push(`LOCATION:${echapper(e.lieu)}`)
  const description = [e.type, e.description, e.lienFacebook].filter(Boolean).join('\n')
  if (description) lignes.push(`DESCRIPTION:${echapper(description)}`)
  lignes.push(`URL:${SITE}/agenda`)
  return ['BEGIN:VEVENT', ...lignes, 'END:VEVENT']
}

/** Fichier .ics complet pour un ou plusieurs rendez-vous. */
export function calendrier(evenements: Evenement[], nom = 'CGT Aveyron — agenda'): string {
  const lignes = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//UD CGT Aveyron//Agenda//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    `X-WR-CALNAME:${echapper(nom)}`,
    'X-WR-TIMEZONE:Europe/Paris',
    ...evenements.flatMap(vevent),
    'END:VCALENDAR',
  ]
  return lignes.map(replier).join('\r\n') + '\r\n'
}
