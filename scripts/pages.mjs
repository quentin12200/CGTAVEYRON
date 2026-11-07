// Fichiers publics fabriqués au build, à partir des données du site (voir donnees.mjs) :
//   - dist/publication/{id}.html : une page par publication avec son titre, son texte et sa photo
//     dans les balises Open Graph. Facebook, WhatsApp ou Messenger affichent ainsi un vrai aperçu
//     quand on partage le lien (ils ne lisent pas le JavaScript). Le site s'y charge normalement.
//   - dist/sitemap.xml et dist/robots.txt : pour les moteurs de recherche.
//   - dist/agenda.ics : l'agenda au format calendrier, pour s'y abonner depuis un téléphone.
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { calendrier } from '../src/lib/ics.ts'
import { videosYoutube } from '../src/lib/liens.ts'
import { SITE, chargerEvenements, chargerPublications, echapperHtml, imagePublication } from './donnees.mjs'

const dist = (chemin) => new URL(`../dist/${chemin}`, import.meta.url)
const gabarit = readFileSync(dist('index.html'), 'utf8')

/** Remplace (ou ajoute) une balise meta dans l'en-tête du gabarit. */
function meta(html, attribut, nom, contenu) {
  const balise = `<meta ${attribut}="${nom}" content="${echapperHtml(contenu)}" />`
  const motif = new RegExp(`<meta ${attribut}="${nom}"[^>]*>`)
  return motif.test(html) ? html.replace(motif, balise) : html.replace('</head>', `    ${balise}\n  </head>`)
}

const resume = (texte, max = 200) => {
  const plat = (texte ?? '').replace(/\s+/g, ' ').trim()
  return plat.length > max ? `${plat.slice(0, max - 1).replace(/\s\S*$/, '')}…` : plat
}

const { publications } = await chargerPublications()
mkdirSync(dist('publication'), { recursive: true })
for (const p of publications) {
  const url = `${SITE}/publication/${encodeURIComponent(p.id)}`
  const description = resume(p.texte) || 'Une publication de l’UD CGT de l’Aveyron.'
  const image = imagePublication(p, videosYoutube) ?? `${SITE}/logo-cgt-aveyron.png`
  let html = gabarit.replace(/<title>[^<]*<\/title>/, `<title>${echapperHtml(p.titre)} — CGT Aveyron</title>`)
  html = meta(html, 'name', 'description', description)
  html = meta(html, 'property', 'og:title', p.titre)
  html = meta(html, 'property', 'og:description', description)
  html = meta(html, 'property', 'og:type', 'article')
  html = meta(html, 'property', 'og:url', url)
  html = meta(html, 'property', 'og:image', image)
  html = meta(html, 'name', 'twitter:card', 'summary_large_image')
  html = html.replace('</head>', `    <link rel="canonical" href="${url}" />\n  </head>`)
  writeFileSync(dist(`publication/${p.id}.html`), html)
}

const pagesFixes = ['', 'agenda', 'contact', 'adherer', 'mentions-legales']
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagesFixes.map((c) => `  <url><loc>${SITE}/${c}</loc></url>`).join('\n')}
${publications.map((p) => `  <url><loc>${SITE}/publication/${encodeURIComponent(p.id)}</loc><lastmod>${p.date.slice(0, 10)}</lastmod></url>`).join('\n')}
</urlset>
`
writeFileSync(dist('sitemap.xml'), sitemap)
writeFileSync(dist('robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`)

const evenements = await chargerEvenements()
writeFileSync(dist('agenda.ics'), calendrier(evenements))

console.log(`✓ ${publications.length} pages d'aperçu, sitemap.xml, robots.txt, agenda.ics (${evenements.length} rendez-vous).`)
