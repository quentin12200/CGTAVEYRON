// Fabrique dist/rss.xml : le fil d'actualités du site au format RSS 2.0.
// Sources : publications importées (src/data/facebook.ts) + collection Firestore « publications »
// lue par l'API REST publique (les règles autorisent la lecture à tous). Un document Firestore
// remplace la publication importée de même identifiant ; « masque » la retire, comme sur le site.
// Sans réseau, le flux est fait avec les seules publications importées (avertissement affiché).
import { writeFileSync } from 'node:fs'
import { videosYoutube } from '../src/lib/liens.ts'
import { SITE, chargerPublications, echapperHtml as echapper, imagePublication } from './donnees.mjs'

const MAX = 50

/** « 2026-11-05T18:21 » (heure de Paris) → date RFC 822 avec le bon décalage (hiver/été). */
function dateRfc822(locale) {
  const [j, h = '12:00'] = locale.split('T')
  const [a, m, d] = j.split('-').map(Number)
  const [hh, mm] = h.split(':').map(Number)
  const supposeUtc = Date.UTC(a, m - 1, d, hh, mm)
  const vu = (fuseau) => new Date(new Date(supposeUtc).toLocaleString('en-US', { timeZone: fuseau })).getTime()
  return new Date(supposeUtc - (vu('Europe/Paris') - vu('UTC'))).toUTCString().replace('GMT', '+0000')
}

const { publications: toutes, enLigne } = await chargerPublications()
const publications = toutes.slice(0, MAX)
const enLigneLength = enLigne

const items = publications.map((p) => {
  const lien = `${SITE}/publication/${encodeURIComponent(p.id)}`
  const image = imagePublication(p, videosYoutube)
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
console.log(`✓ dist/rss.xml : ${publications.length} publications (${enLigneLength} lues dans Firestore).`)
