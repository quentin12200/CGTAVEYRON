import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
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
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="overflow-hidden bg-surface sm:rounded-2xl"
    >
      <div className="flex items-baseline justify-between gap-4 px-5 pt-5">
        <PastilleTheme theme={pub.theme} />
        <time dateTime={pub.date} className="text-sm text-muted">{dateRelative(pub.date)}</time>
      </div>

      {avecVisuel ? (
        <>
          <div className="px-5 pt-3 pb-4">
            <h2 className="font-condensed text-[1.9rem] leading-[1.02] font-[800] text-balance">
              <LienPublication pub={pub} className="hover:text-rouge">{pub.titre}</LienPublication>
            </h2>
            {pub.unionLocale && <p className="mt-1 text-muted">{pub.unionLocale}</p>}
            {pub.texte && <p className="mt-3 line-clamp-3 max-w-[62ch]">{pub.texte}</p>}
          </div>
          <Galerie visuels={pub.visuels!} id={pub.id} />
        </>
      ) : (
        <div className="px-5 pt-4 pb-2">
          <h2 className="border-l-4 border-rouge pl-4 font-condensed text-[2.4rem] leading-[0.98] font-[850] text-balance">
            <LienPublication pub={pub} className="hover:text-rouge">{pub.titre}</LienPublication>
          </h2>
          {pub.texte && <p className="mt-4 line-clamp-4 max-w-[62ch] text-muted">{pub.texte}</p>}
        </div>
      )}

      <div className="flex items-center gap-1 px-3 py-3">
        <Reaction id={pub.id} />
        <Partager titre={pub.titre} chemin={lien} />
        <LienPublication pub={pub} className="ml-auto rounded-full px-4 py-2 font-semibold text-rouge hover:bg-[var(--rule)]/60">
          {pub.lienFacebook ? (pub.lienFacebookLibelle === 'Voir la vidéo sur Facebook' ? 'Voir la vidéo' : 'Voir sur Facebook') : 'Lire'}
        </LienPublication>
      </div>
    </motion.article>
  )
}
