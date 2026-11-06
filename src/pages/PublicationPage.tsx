import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePublications } from '../data/publications'
import { PhotosEnPile } from '../components/Galerie'
import { PastilleTheme } from '../components/PastilleTheme'
import { Partager, Reaction } from '../components/Actions'
import { formatJourMois, lireDate } from '../lib/format'
import { SITE } from '../config'
import { Introuvable } from './Introuvable'

export function PublicationPage() {
  const { id } = useParams()
  const publications = usePublications()
  const pub = publications.find((p) => p.id === id)

  useEffect(() => {
    if (pub) document.title = `${pub.titre} — ${SITE.nom}`
  }, [pub])

  if (!pub) return <Introuvable />

  return (
    <main id="contenu" className="mx-auto max-w-3xl pt-6 sm:px-6 sm:pt-12">
      <div className="px-4 sm:px-0">
        <Link to="/" className="inline-flex items-center gap-1 font-semibold text-muted hover:text-[var(--text)]">
          <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" />
          </svg>
          Toutes les publications
        </Link>
        <div className="mt-8 flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <PastilleTheme theme={pub.theme} />
          <time dateTime={pub.date} className="text-muted">
            Publié le {formatJourMois(pub.date)} {lireDate(pub.date).getFullYear()}
          </time>
        </div>
        <h1 className="mt-3 font-condensed text-[clamp(2.6rem,8vw,4.5rem)] leading-[0.92] font-[900] text-balance">
          {pub.titre}
        </h1>
        {pub.unionLocale && <p className="mt-3 text-lg text-muted">{pub.unionLocale}</p>}
      </div>

      {pub.visuels?.length ? (
        <div className="mt-8">
          <PhotosEnPile visuels={pub.visuels} />
        </div>
      ) : null}

      <div className="px-4 sm:px-0">
        {pub.texte && <p className="mt-8 max-w-[62ch] text-lg leading-relaxed whitespace-pre-line">{pub.texte}</p>}
        {pub.lienFacebook && (
          <a
            href={pub.lienFacebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex h-12 items-center rounded-full border border-rule px-6 font-semibold text-rouge-texte hover:bg-[var(--rule)]/60"
          >
            {pub.lienFacebookLibelle ?? 'Voir sur Facebook'}
          </a>
        )}
        <div className="mt-8 flex items-center gap-1 border-t border-rule pt-4">
          <Reaction id={pub.id} />
          <Partager titre={pub.titre} chemin={`/publication/${pub.id}`} />
        </div>
      </div>
    </main>
  )
}
