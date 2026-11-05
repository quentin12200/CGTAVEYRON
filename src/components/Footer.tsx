import { Link } from 'react-router-dom'
import { SITE } from '../config'
import { Logo } from './Logo'

export function Footer() {
  return (
    <footer className="mt-24 border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-[1fr_auto]">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-muted">{SITE.nomLong}</p>
          <p className="mt-1 text-muted">
            <a href={`mailto:${SITE.email}`} className="hover:text-[var(--text)]">{SITE.email}</a>
          </p>
        </div>
        <ul className="flex flex-wrap gap-x-6 gap-y-2 text-muted">
          <li><Link className="hover:text-[var(--text)]" to="/agenda">Agenda</Link></li>
          <li><Link className="hover:text-[var(--text)]" to="/contact">Contact</Link></li>
          <li><Link className="hover:text-[var(--text)]" to="/adherer">Adhérer</Link></li>
          {SITE.facebookUrl && (
            <li><a className="hover:text-[var(--text)]" href={SITE.facebookUrl} rel="noopener">Facebook</a></li>
          )}
          <li><Link className="hover:text-[var(--text)]" to="/mentions-legales">Mentions légales</Link></li>
        </ul>
      </div>
    </footer>
  )
}
