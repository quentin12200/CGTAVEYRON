// Fichiers publics fabriqués au build, à partir des données du site (voir donnees.mjs) :
//   - une page HTML par adresse (accueil, agenda, contact, adhérer, mentions légales, chaque publication)
//     avec son titre, sa description, son adresse de référence (canonical), ses balises Open Graph
//     et ses données structurées schema.org (JSON-LD). Le texte de la page est aussi écrit dans
//     <div id="root"> : les moteurs et les assistants IA qui ne lancent pas le JavaScript le lisent ;
//     pour le visiteur, React remplace ce texte dès que le site se charge.
//   - dist/app.html : le gabarit neutre, servi pour toute autre adresse (/admin, page introuvable…).
//   - dist/sitemap.xml, dist/robots.txt, dist/llms.txt : pour les moteurs de recherche et les IA.
//   - dist/agenda.ics : l'agenda au format calendrier, pour s'y abonner depuis un téléphone.
// Ne jamais rien inventer ici (adresse du siège, horaires…) : seulement ce que le site affiche déjà.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { calendrier, lireHeure, parisVersUtc } from '../src/lib/ics.ts'
import { videosYoutube } from '../src/lib/liens.ts'
import {
  SITE,
  chargerEvenements,
  chargerPublications,
  chargerReglages,
  chargerUnions,
  echapperHtml as h,
  imagePublication,
} from './donnees.mjs'

const dist = (chemin) => new URL(`../dist/${chemin}`, import.meta.url)
// Relancé sans nouveau build Vite, index.html est déjà la page d'accueil : on repart du gabarit gardé.
const index = readFileSync(dist('index.html'), 'utf8')
const gabarit = index.includes('rel="canonical"') && existsSync(dist('app.html')) ? readFileSync(dist('app.html'), 'utf8') : index
writeFileSync(dist('app.html'), gabarit)

const [{ publications }, evenements, unions, reglages] = await Promise.all([
  chargerPublications(),
  chargerEvenements(),
  chargerUnions(),
  chargerReglages(),
])

// Textes par défaut des pages (les mêmes que REGLAGES_DEFAUT dans src/data/reglages.ts),
// remplacés par ceux modifiés depuis /admin quand il y en a.
const texte = {
  nomLong: 'Union départementale CGT de l’Aveyron',
  email: 'ud@cgt12.fr',
  facebookUrl: 'https://www.facebook.com/udcgt.aveyron',
  adhesionUrl: 'https://www.cgt.fr/syndicalisation/syndiquez-vous#forward',
  adhererIntro: 'Se syndiquer, c’est ne plus être seul au travail. La cotisation ouvre droit à un crédit d’impôt de 66 %.',
  contactIntro: 'L’Union départementale et les unions locales vous accueillent, syndiqué ou non.',
  agendaIntro: 'Manifestations, rassemblements, congrès et permanences de la CGT dans le département.',
  ...Object.fromEntries(Object.entries(reglages).filter(([, v]) => typeof v === 'string' && v.trim())),
}

const LOGO = `${SITE}/logo-cgt-aveyron.png`
const ID_ORGANISATION = `${SITE}/#organisation`
const organisation = {
  '@type': 'WorkersUnion',
  '@id': ID_ORGANISATION,
  name: texte.nomLong,
  alternateName: 'CGT Aveyron',
  url: `${SITE}/`,
  logo: LOGO,
  email: texte.email,
  sameAs: [texte.facebookUrl],
  areaServed: { '@type': 'AdministrativeArea', name: 'Aveyron' },
  parentOrganization: { '@type': 'WorkersUnion', name: 'Confédération générale du travail (CGT)', url: 'https://www.cgt.fr' },
}
const refOrganisation = { '@id': ID_ORGANISATION }

/** Remplace (ou ajoute) une balise meta dans l'en-tête. */
function meta(html, attribut, nom, contenu) {
  const balise = `<meta ${attribut}="${nom}" content="${h(contenu)}" />`
  const motif = new RegExp(`<meta ${attribut}="${nom}"[^>]*>`)
  return motif.test(html) ? html.replace(motif, balise) : html.replace('</head>', `    ${balise}\n  </head>`)
}

const resume = (t, max = 160) => {
  const plat = (t ?? '').replace(/\s+/g, ' ').trim()
  return plat.length > max ? `${plat.slice(0, max - 1).replace(/\s\S*$/, '')}…` : plat
}

const paragraphes = (t) =>
  (t ?? '')
    .split(/\n\s*\n/)
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => `<p>${h(x).replace(/\n/g, '<br />')}</p>`)
    .join('\n')

const dateFr = (d) =>
  new Date(`${d.slice(0, 10)}T12:00:00Z`).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Europe/Paris' })

/** Navigation commune, écrite dans chaque page pour relier les pages entre elles. */
const navigation = `<nav aria-label="Pages du site"><a href="/">Actualités</a> · <a href="/agenda">Agenda</a> · <a href="/adherer">Adhérer</a> · <a href="/contact">Contact</a> · <a href="/mentions-legales">Mentions légales</a></nav>`

/** Écrit une page : titre, description, canonical, Open Graph, JSON-LD et texte lisible sans JavaScript. */
function page(fichier, { titre, description, chemin, type = 'website', image = LOGO, grandeImage = false, donnees, corps }) {
  const url = `${SITE}${chemin}`
  let html = gabarit.replace(/<title>[^<]*<\/title>/, `<title>${h(titre)}</title>`)
  html = meta(html, 'name', 'description', description)
  html = meta(html, 'property', 'og:title', titre)
  html = meta(html, 'property', 'og:description', description)
  html = meta(html, 'property', 'og:type', type)
  html = meta(html, 'property', 'og:url', url)
  html = meta(html, 'property', 'og:image', image)
  html = meta(html, 'name', 'twitter:card', grandeImage ? 'summary_large_image' : 'summary')
  const jsonld = JSON.stringify({ '@context': 'https://schema.org', '@graph': donnees }).replace(/</g, '\\u003c')
  html = html.replace(
    '</head>',
    `    <link rel="canonical" href="${h(url)}" />\n    <script type="application/ld+json">${jsonld}</script>\n  </head>`,
  )
  html = html.replace('<div id="root"></div>', `<div id="root"><main>\n${corps}\n${navigation}\n</main></div>`)
  writeFileSync(dist(fichier), html)
}

// Accueil
const derniere = publications[0]?.date.slice(0, 10)
page('index.html', {
  titre: 'CGT Aveyron — actualités de l’Union départementale',
  description:
    'L’actualité de l’Union départementale CGT de l’Aveyron : mobilisations, vie syndicale, agenda et permanences des unions locales.',
  chemin: '/',
  donnees: [
    organisation,
    { '@type': 'WebSite', '@id': `${SITE}/#site`, url: `${SITE}/`, name: 'CGT Aveyron', inLanguage: 'fr-FR', publisher: refOrganisation },
  ],
  corps: `<h1>CGT Aveyron — ${h(texte.nomLong)}</h1>
<p>Mobilisations, vie syndicale, agenda et permanences des unions locales de la CGT dans l’Aveyron.</p>
<h2>Dernières publications</h2>
<ul>
${publications
  .slice(0, 30)
  .map((p) => `<li><a href="/publication/${encodeURIComponent(p.id)}">${h(p.titre)}</a> (${dateFr(p.date)})</li>`)
  .join('\n')}
</ul>`,
})

// Publications
mkdirSync(dist('publication'), { recursive: true })
for (const p of publications) {
  const chemin = `/publication/${encodeURIComponent(p.id)}`
  const description = resume(p.texte) || 'Une publication de l’UD CGT de l’Aveyron.'
  const photo = imagePublication(p, videosYoutube)
  page(`publication/${p.id}.html`, {
    titre: `${p.titre} — CGT Aveyron`,
    description,
    chemin,
    type: 'article',
    image: photo ?? LOGO,
    grandeImage: Boolean(photo),
    donnees: [
      organisation,
      {
        '@type': 'Article',
        headline: p.titre.slice(0, 110),
        description,
        datePublished: p.date,
        inLanguage: 'fr-FR',
        image: [photo ?? LOGO],
        author: refOrganisation,
        publisher: refOrganisation,
        mainEntityOfPage: `${SITE}${chemin}`,
        ...(p.theme && { articleSection: p.theme }),
      },
    ],
    corps: `<article>
<h1>${h(p.titre)}</h1>
<p><time datetime="${h(p.date)}">${dateFr(p.date)}</time>${p.theme ? ` · ${h(p.theme)}` : ''}</p>
${paragraphes(p.texte)}
${p.lienFacebook ? `<p><a href="${h(p.lienFacebook)}">Voir sur Facebook</a></p>` : ''}
</article>`,
  })
}

// Agenda : chaque rendez-vous en Event schema.org (date en UTC si l'heure est connue).
const debutEvenement = (e) => {
  const heure = lireHeure(e.heure)
  if (!heure) return e.date
  const [a, m, j] = e.date.split('-').map(Number)
  return parisVersUtc(a, m, j, heure[0], heure[1]).toISOString().replace('.000Z', 'Z')
}
page('agenda.html', {
  titre: 'Agenda — CGT Aveyron',
  description: resume(texte.agendaIntro),
  chemin: '/agenda',
  donnees: [
    organisation,
    ...evenements.map((e) => ({
      '@type': 'Event',
      '@id': `${SITE}/agenda#${encodeURIComponent(e.id)}`,
      name: e.titre,
      startDate: debutEvenement(e),
      ...(e.description && { description: e.description }),
      eventStatus: 'https://schema.org/EventScheduled',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      ...(e.lieu && {
        location: {
          '@type': 'Place',
          name: e.lieu,
          address: { '@type': 'PostalAddress', addressLocality: e.lieu, addressRegion: 'Aveyron', addressCountry: 'FR' },
        },
      }),
      organizer: refOrganisation,
      url: `${SITE}/agenda`,
      ...(e.lienFacebook && { sameAs: e.lienFacebook }),
    })),
  ],
  corps: `<h1>Agenda</h1>
<p>${h(texte.agendaIntro)}</p>
<ul>
${[...evenements]
  .reverse()
  .map(
    (e) =>
      `<li><strong>${h(e.titre)}</strong>, ${dateFr(e.date)}${e.heure ? `, ${h(e.heure)}` : ''}${e.lieu ? `, ${h(e.lieu)}` : ''}${e.description ? `. ${h(e.description)}` : ''}</li>`,
  )
  .join('\n')}
</ul>
<p><a href="webcal://cgtaveyron.web.app/agenda.ics">S’abonner à l’agenda</a></p>`,
})

// Contact : les unions locales comme organisations rattachées à l'UD, avec leurs vraies coordonnées.
const adressePostale = (adresse) => {
  const lignes = adresse.split('\n').map((l) => l.trim()).filter(Boolean)
  const ville = lignes.at(-1)?.match(/^(\d{5})\s+(.+)$/)
  return {
    '@type': 'PostalAddress',
    ...(ville ? { streetAddress: lignes.slice(0, -1).join(', '), postalCode: ville[1], addressLocality: ville[2] } : { streetAddress: lignes.join(', ') }),
    addressRegion: 'Aveyron',
    addressCountry: 'FR',
  }
}
const locales = unions.filter((u) => u.id !== 'ud')
page('contact.html', {
  titre: 'Contact — CGT Aveyron',
  description: resume(`${texte.contactIntro} Adresses et téléphones des unions locales de l’Aveyron.`),
  chemin: '/contact',
  donnees: [
    {
      ...organisation,
      subOrganization: locales.map((u) => ({
        '@type': 'WorkersUnion',
        name: u.nom,
        ...(u.adresse && { address: adressePostale(u.adresse) }),
        ...(u.telephone && { telephone: u.telephone.split('/')[0].trim() }),
        ...(u.email && { email: u.email }),
      })),
    },
  ],
  corps: `<h1>Contact</h1>
<p>${h(texte.contactIntro)}</p>
<p>Union départementale : <a href="mailto:${h(texte.email)}">${h(texte.email)}</a></p>
<ul>
${locales
  .map(
    (u) =>
      `<li><strong>${h(u.nom)}</strong>${u.adresse ? `, ${h(u.adresse.replace(/\n/g, ', '))}` : ''}${u.telephone ? `, ${h(u.telephone)}` : ''}${u.email ? `, ${h(u.email)}` : ''}</li>`,
  )
  .join('\n')}
</ul>`,
})

page('adherer.html', {
  titre: 'Adhérer à la CGT — CGT Aveyron',
  description: resume(texte.adhererIntro),
  chemin: '/adherer',
  donnees: [organisation],
  corps: `<h1>Adhérer</h1>
<p>${h(texte.adhererIntro)}</p>
<p><a href="${h(texte.adhesionUrl)}">Adhérer en ligne</a> ou auprès de votre <a href="/contact">union locale</a>.</p>`,
})

page('mentions-legales.html', {
  titre: 'Mentions légales — CGT Aveyron',
  description: 'Éditeur, hébergement, données personnelles et cookies du site de l’UD CGT de l’Aveyron.',
  chemin: '/mentions-legales',
  donnees: [organisation],
  corps: `<h1>Mentions légales</h1>
<p>Site de l’${h(texte.nomLong)}. Contact : <a href="mailto:${h(texte.email)}">${h(texte.email)}</a>.</p>`,
})

// Plan du site, robots, llms.txt
const pagesFixes = [
  ['', derniere],
  ['agenda'],
  ['contact'],
  ['adherer'],
  ['mentions-legales'],
]
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pagesFixes.map(([c, d]) => `  <url><loc>${SITE}/${c}</loc>${d ? `<lastmod>${d}</lastmod>` : ''}</url>`).join('\n')}
${publications.map((p) => `  <url><loc>${SITE}/publication/${encodeURIComponent(p.id)}</loc><lastmod>${p.date.slice(0, 10)}</lastmod></url>`).join('\n')}
</urlset>
`
writeFileSync(dist('sitemap.xml'), sitemap)
writeFileSync(dist('robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\n\nSitemap: ${SITE}/sitemap.xml\n`)

// llms.txt : résumé du site pour les assistants IA (format proposé sur llmstxt.org).
writeFileSync(
  dist('llms.txt'),
  `# CGT Aveyron

> Site de l’${texte.nomLong}, syndicat de salariés du département de l’Aveyron (Occitanie), membre de la Confédération générale du travail. Actualités, mobilisations, agenda et coordonnées des unions locales.

Contact : ${texte.email} · Facebook : ${texte.facebookUrl}

## Pages

- [Actualités](${SITE}/) : dernières publications de l’UD
- [Agenda](${SITE}/agenda) : manifestations, rassemblements et rendez-vous ([calendrier .ics](${SITE}/agenda.ics))
- [Contact](${SITE}/contact) : adresses et téléphones des unions locales (${locales.map((u) => u.nom.replace(/^Union locale (de |d’)/, '')).join(', ')})
- [Adhérer](${SITE}/adherer) : se syndiquer à la CGT
- [Flux RSS](${SITE}/rss.xml)

## Dernières publications

${publications
  .slice(0, 20)
  .map((p) => {
    const extrait = resume(p.texte, 140)
    return `- [${p.titre}](${SITE}/publication/${encodeURIComponent(p.id)}) (${p.date.slice(0, 10)})${extrait ? ` : ${extrait}` : ''}`
  })
  .join('\n')}
`,
)

writeFileSync(dist('agenda.ics'), calendrier(evenements))

console.log(
  `✓ ${publications.length} publications et 5 pages fixes (texte + JSON-LD), sitemap.xml, robots.txt, llms.txt, agenda.ics (${evenements.length} rendez-vous).`,
)
