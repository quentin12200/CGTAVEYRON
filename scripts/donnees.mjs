// Données du site pour les fichiers fabriqués au build (flux RSS, pages d'aperçu, plan du site, agenda) :
// listes de départ du dépôt + collections Firestore lues par l'API REST publique, avec les mêmes règles
// que le site (un document Firestore remplace l'élément de même id ; « masque » le retire).
import { publicationsFacebook } from '../src/data/facebook.ts'
import { evenements as evenementsDepart, unionsLocales as unionsDepart } from '../src/data/demo.ts'

export const SITE = 'https://cgtaveyron.web.app'
const PROJET = 'cgtaveyron'

function valeur(v) {
  if (!v) return undefined
  if ('stringValue' in v) return v.stringValue
  if ('booleanValue' in v) return v.booleanValue
  if ('integerValue' in v) return Number(v.integerValue)
  if ('doubleValue' in v) return v.doubleValue
  if ('nullValue' in v) return null
  if ('arrayValue' in v) return (v.arrayValue.values ?? []).map(valeur)
  if ('mapValue' in v) return Object.fromEntries(Object.entries(v.mapValue.fields ?? {}).map(([k, x]) => [k, valeur(x)]))
  return undefined
}

async function collection(nom) {
  const hote = process.env.FIRESTORE_EMULATOR_HOST
  const base = hote
    ? `http://${hote}/v1/projects/${process.env.RSS_PROJET ?? PROJET}/databases/(default)/documents/${nom}`
    : `https://firestore.googleapis.com/v1/projects/${PROJET}/databases/(default)/documents/${nom}`
  const docs = []
  let jeton = ''
  do {
    const r = await fetch(`${base}?pageSize=300${jeton ? `&pageToken=${jeton}` : ''}`)
    if (!r.ok) throw new Error(`Firestore a répondu ${r.status}`)
    const json = await r.json()
    for (const d of json.documents ?? []) docs.push({ ...valeur({ mapValue: { fields: d.fields } }), id: d.name.split('/').pop() })
    jeton = json.nextPageToken ?? ''
  } while (jeton)
  return docs
}

async function fusion(nom, depart) {
  let enLigne = []
  try {
    enLigne = await collection(nom)
  } catch (e) {
    console.warn(`⚠ « ${nom} » sans Firestore (${e.message}) : données du dépôt seulement.`)
  }
  const parId = new Map(depart.map((x) => [x.id, x]))
  for (const x of enLigne) parId.set(x.id, x)
  return { liste: [...parId.values()].filter((x) => !x.masque), enLigne: enLigne.length }
}

/** Publications visibles, de la plus récente à la plus ancienne. */
export async function chargerPublications() {
  const { liste, enLigne } = await fusion('publications', publicationsFacebook)
  return { publications: liste.filter((p) => p.titre && p.date).sort((a, b) => b.date.localeCompare(a.date)), enLigne }
}

/** Rendez-vous visibles, du plus ancien au plus récent. */
export async function chargerEvenements() {
  const { liste } = await fusion('evenements', evenementsDepart)
  return liste.filter((e) => e.titre && e.date).sort((a, b) => a.date.localeCompare(b.date))
}

/** Unions locales visibles (UD en premier, puis par nom). */
export async function chargerUnions() {
  const { liste } = await fusion('unionsLocales', unionsDepart)
  return liste.filter((u) => u.nom).sort((a, b) => (a.id === 'ud' ? -1 : b.id === 'ud' ? 1 : a.nom.localeCompare(b.nom, 'fr')))
}

/** Textes modifiés depuis /admin (document « reglages/site ») ; {} si rien ou hors ligne. */
export async function chargerReglages() {
  try {
    return (await collection('reglages')).find((d) => d.id === 'site') ?? {}
  } catch {
    return {}
  }
}

export const echapperHtml = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Image d'une publication en adresse complète : photo, sinon vignette YouTube, sinon rien. */
export function imagePublication(p, videosYoutube) {
  const photo = (p.visuels ?? []).find((v) => v?.src)?.src
  if (photo) return photo.startsWith('http') ? photo : SITE + photo
  const video = videosYoutube(p.texte, p.lienFacebook)[0]
  return video ? `https://i.ytimg.com/vi/${video}/hqdefault.jpg` : null
}
