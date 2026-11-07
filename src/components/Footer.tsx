import { Link } from 'react-router-dom'
import { useReglages } from '../data/reglages'
import { Logo } from './Logo'

const lien = 'text-white/85 underline-offset-4 hover:text-white hover:underline'

/** Bas de page : bandeau encre avec filet rouge, comme le bas d'un tract. */
export function Footer() {
  const SITE = useReglages()
  return (
    <footer className="mt-24 border-t-8 border-rouge bg-encre text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto] md:items-start">
        <div>
          <Logo />
          <p className="mt-4 max-w-sm font-condensed text-2xl leading-tight font-[850]">{SITE.nomLong}</p>
          <p className="mt-2">
            <a href={`mailto:${SITE.email}`} className={lien}>
              {SITE.email}
            </a>
          </p>
          <Link
            to="/adherer"
            className="mt-6 inline-flex h-11 items-center rounded-full bg-rouge px-5 font-semibold text-white appui hover:bg-rouge-fonce"
          >
            Adhérer
          </Link>
        </div>
        <nav aria-label="Pied de page">
          <ul className="grid grid-cols-2 gap-x-10 gap-y-3 sm:grid-cols-3 md:grid-cols-2">
            <li><Link className={lien} to="/agenda">Agenda</Link></li>
            <li><Link className={lien} to="/contact">Contact</Link></li>
            <li><Link className={lien} to="/adherer">Adhérer</Link></li>
            <li><a className={lien} href={SITE.busUrl} target="_blank" rel="noopener noreferrer">Inscription bus</a></li>
            {SITE.facebookUrl && (
              <li><a className={lien} href={SITE.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            )}
            <li><Link className={lien} to="/mentions-legales">Mentions légales</Link></li>
            <li><a className={lien} href="/rss.xml" type="application/rss+xml">Flux RSS</a></li>
          </ul>
        </nav>
      </div>
    </footer>
  )
}
