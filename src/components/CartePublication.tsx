import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import type { Publication } from '../data/types'
import { dateRelative } from '../lib/format'
import { Galerie } from './Galerie'
import { PastilleTheme } from './PastilleTheme'
import { Partager, Reaction } from './Actions'

/** Lien vers la publication : sur Facebook pour les publications importées (photos, vidéo), sinon sur le site. */
function LienPublication({ pub, className, children }: { pub: Publication; className?: string; children: ReactNode }) {
  if (pub.lienFacebook) {
    return (
      <a href={pub.lienFacebook} target="_blank" rel="noopener noreferrer" className={className}>
        {children}
      </a>
    )
  }
  return (
    <Link to={`/publication/${pub.id}`} className={className}>
      {children}
    </Link>
  )
}

export function CartePublication({ pub }: { pub: Publication }) {
  const lien = `/publication/${pub.id}`
  const avecVisuel = !!pub.visuels?.length

  return (
    <article className="overflow-hidden border-t-4 border-[var(--text)] bg-surface">
      <div className="flex items-baseline justify-between gap-4 px-5 pt-5">
        <PastilleTheme theme={pub.theme} />
        <time dateTime={pub.date} className="text-sm text-muted">{dateRelative(pub.date)}</time>
      </div>

      {avecVisuel ? (
        <>
          <div className="px-5 pt-3 pb-4">
            <h2 className="font-condensed text-[1.9rem] leading-[1.02] font-[850] text-balance sm:text-[2.1rem]">
              <LienPublication pub={pub} className="hover:text-rouge-texte">{pub.titre}</LienPublication>
            </h2>
            {pub.unionLocale && <p className="mt-1 text-muted">{pub.unionLocale}</p>}
            {pub.texte && <p className="mt-3 line-clamp-3 max-w-[62ch]">{pub.texte}</p>}
          </div>
          <Galerie visuels={pub.visuels!} id={pub.id} />
        </>
      ) : (
        <div className="px-5 pt-4 pb-2">
          <h2 className="font-condensed text-[2.1rem] leading-[0.98] font-[900] text-balance sm:text-[2.6rem]">
            <LienPublication pub={pub} className="hover:text-rouge-texte">{pub.titre}</LienPublication>
          </h2>
          {pub.texte && <p className="mt-4 line-clamp-4 max-w-[62ch]">{pub.texte}</p>}
        </div>
      )}

      <div className="flex items-center gap-1 px-3 py-3">
        <Reaction id={pub.id} />
        <Partager titre={pub.titre} chemin={lien} />
        <LienPublication
          pub={pub}
          className="ml-auto flex h-10 shrink-0 items-center gap-1 whitespace-nowrap rounded-full px-3 font-semibold text-rouge-texte hover:bg-[var(--rule)]/60"
        >
          {pub.lienFacebook ? (
            <>
              {pub.lienFacebookLibelle === 'Voir la vidéo sur Facebook' ? 'Vidéo' : 'Facebook'}
              <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M7 17L17 7M9 7h8v8" />
              </svg>
              <span className="sr-only">(ouvre Facebook)</span>
            </>
          ) : (
            'Lire'
          )}
        </LienPublication>
      </div>
    </article>
  )
}
