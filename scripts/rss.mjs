// Fabrique dist/rss.xml : le fil d'actualités du site au format RSS 2.0.
// Sources : publications importées (src/data/facebook.ts) + collection Firestore « publications »
// lue par l'API REST publique (les règles autorisent la lecture à tous). Un document Firestore
// remplace la publication importée de même identifiant ; « masque » la retire, comme sur le site.
// Sans réseau, le flux est fait avec les seules publications importées (avertissement affiché).
import { writeFileSync } from 'node:fs'
import { publicationsFacebook } from '../src/data/facebook.ts'
import { videosYoutube } from '../src/lib/liens.ts'

const SITE = 'https://cgtaveyron.web.app'
const PROJET = 'cgtaveyron'
const MAX = 50

/** Convertit une valeur de l'API REST Firestore en valeur JavaScript. */
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

async function publicationsFirestore() {
  const hote = process.env.FIRESTORE_EMULATOR_HOST
  const base = hote
    ? `http://${hote}/v1/projects/${process.env.RSS_PROJET ?? PROJET}/databases/(default)/documents/publications`
    : `https://firestore.googleapis.com/v1/projects/${PROJET}/databases/(default)/documents/publications`
  const docs = []
  let jeton = ''
  do {
    const r = await fetch(`${base}?pageSize=300${jeton ? `&pageToken=${jeton}` : ''}`)
    if (!r.ok) throw new Error(`Firestore a répondu ${r.status}`)
    const json = await r.json()
    for (const d of json.documents ?? []) {
      const id = d.name.split('/').pop()
      docs.push({ ...valeur({ mapValue: { fields: d.fields } }), id })
    }
    jeton = json.nextPageToken ?? ''
  } while (jeton)
  return docs
}

const echapper = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** « 2026-11-05T18:21 » (heure de Paris) → date RFC 822 avec le bon décalage (hiver/été). */
function dateRfc822(locale) {
  const [j, h = '12:00'] = locale.split('T')
  const [a, m, d] = j.split('-').map(Number)
  const [hh, mm] = h.split(':').map(Number)
  // Décalage de Paris à cette date : on compare l'heure affichée à Paris pour l'instant UTC supposé.
  const supposeUtc = Date.UTC(a, m - 1, d, hh, mm)
  const parisVu = new Date(new Date(supposeUtc).toLocaleString('en-US', { timeZone: 'Europe/Paris' }))
  const decalage = parisVu.getTime() - new Date(new Date(supposeUtc).toLocaleString('en-US', { timeZone: 'UTC' })).getTime()
  return new Date(supposeUtc - decalage).toUTCString().replace('GMT', '+0000')
}

let enLigne = []
try {
  enLigne = await publicationsFirestore()
} catch (e) {
  console.warn(`⚠ Flux RSS sans les publications de Firestore (${e.message}).`)
}
const parId = new Map(publicationsFacebook.map((p) => [p.id, p]))
for (const p of enLigne) parId.set(p.id, p)
const publications = [...parId.values()]
  .filter((p) => !p.masque && p.titre && p.date)
  .sort((a, b) => b.date.localeCompare(a.date))
  .slice(0, MAX)

const items = publications.map((p) => {
  const lien = `${SITE}/publication/${encodeURIComponent(p.id)}`
  const photo = (p.visuels ?? []).find((v) => v?.src)?.src
  // Sans photo, la vignette de la première vidéo YouTube citée sert d'image.
  const video = videosYoutube(p.texte, p.lienFacebook)[0]
  const image = photo
    ? photo.startsWith('http') ? photo : SITE + photo
    : video ? `https://i.ytimg.com/vi/${video}/hqdefault.jpg` : null
  const texte = p.texte ?? ''
  const html =
    (image ? `<p><img src="${echapper(image)}" alt="" /></p>` : '') +
    texte
      .split(/\n{2,}/)
      .map((para) => `<p>${echapper(para).replace(/\n/g, '<br />')}</p>`)
      .join('')
  return `    <item>
      <title>${echapper(p.titre)}</title>
      <link>${lien}</link>
      <guid isPermaLink="true">${lien}</guid>
      <pubDate>${dateRfc822(p.date)}</pubDate>
      <category>${echapper(p.theme ?? 'Actualité')}</category>
      <description>${echapper(texte)}</description>
      <content:encoded>${echapper(html)}</content:encoded>${image ? `\n      <media:content url="${echapper(image)}" medium="image" />` : ''}
    </item>`
})

// Date du flux = date de la publication la plus récente : le fichier ne change que si le fil change.
const derniere = publications[0] ? dateRfc822(publications[0].date) : new Date(0).toUTCString()
const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>CGT Aveyron — actualités</title>
    <link>${SITE}/</link>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml" />
    <description>L’actualité de l’Union départementale CGT de l’Aveyron : mobilisations, vie syndicale, permanences des unions locales.</description>
    <language>fr-FR</language>
    <lastBuildDate>${derniere}</lastBuildDate>
    <image>
      <url>${SITE}/logo-cgt-aveyron.png</url>
      <title>CGT Aveyron — actualités</title>
      <link>${SITE}/</link>
    </image>
${items.join('\n')}
  </channel>
</rss>
`
writeFileSync(new URL('../dist/rss.xml', import.meta.url), rss)
console.log(`✓ dist/rss.xml : ${publications.length} publications (${enLigne.length} lues dans Firestore).`)
