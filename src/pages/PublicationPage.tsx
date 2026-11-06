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
      <Link to="/" className="mx-4 inline-flex items-center gap-1 font-semibold text-muted hover:text-[var(--text)] sm:mx-0">
        <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" />
        </svg>
        Toutes les publications
      </Link>

      {/* Comme sur Facebook : de quoi on parle d'abord, les photos ensuite. */}
      <article className="mt-6 border-t-4 border-[var(--text)] bg-surface">
        <div className="px-5 pt-6 pb-7 sm:px-8 sm:pt-8">
          <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
            <PastilleTheme theme={pub.theme} />
            <time dateTime={pub.date} className="text-muted">
              {formatJourMois(pub.date)} {lireDate(pub.date).getFullYear()}
            </time>
          </div>
          <h1 className="mt-3 font-condensed text-[clamp(2.4rem,7.5vw,4.25rem)] leading-[0.92] font-[900] text-balance">
            {pub.titre}
          </h1>
          {pub.unionLocale && <p className="mt-3 text-lg text-muted">{pub.unionLocale}</p>}
          {pub.texte && <p className="mt-6 max-w-[62ch] text-lg leading-relaxed whitespace-pre-line">{pub.texte}</p>}
        </div>

        {pub.visuels?.length ? <PhotosEnPile visuels={pub.visuels} /> : null}

        <div className="flex flex-wrap items-center gap-1 px-3 py-3 sm:px-6">
          <Reaction id={pub.id} />
          <Partager titre={pub.titre} chemin={`/publication/${pub.id}`} />
          {pub.lienFacebook && (
            <a
              href={pub.lienFacebook}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex h-10 items-center gap-1 rounded-full px-3 font-semibold whitespace-nowrap text-rouge-texte hover:bg-[var(--rule)]/60"
            >
              {pub.lienFacebookLibelle ?? 'Voir sur Facebook'}
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
            </a>
          )}
        </div>
      </article>
    </main>
  )
}
