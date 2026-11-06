import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import { Logo } from './Logo'
import { SITE as CONFIG } from '../config'
import { useReglages } from '../data/reglages'

const NAV = [
  { to: '/', label: 'Actualités' },
  { to: '/agenda', label: 'Agenda' },
  { to: '/contact', label: 'Contact' },
]

export function Header() {
  const [reduit, setReduit] = useState(false)
  const [ouvert, setOuvert] = useState(false)
  const SITE = { ...useReglages(), nom: CONFIG.nom }

  useEffect(() => {
    const onScroll = () => setReduit(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = ouvert ? 'hidden' : ''
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOuvert(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [ouvert])

  return (
    <header
      className={`sticky top-0 z-40 border-b transition-[background,border-color,backdrop-filter] duration-300 ${
        reduit ? 'border-rule bg-[color-mix(in_srgb,var(--bg)_85%,transparent)] backdrop-blur-xl' : 'border-transparent'
      }`}
    >
      <div
        className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-[height] duration-300 sm:px-6 ${
          reduit ? 'h-14' : 'h-20'
        }`}
      >
        <Link to="/" aria-label={`${SITE.nom}, accueil`} className="rounded-md">
          <Logo compact={reduit} />
        </Link>

        <nav aria-label="Navigation principale" className="hidden items-center gap-1 md:flex">
          {NAV.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `relative rounded-full px-4 py-2 font-medium transition-colors ${
                  isActive ? 'text-[var(--text)]' : 'text-muted hover:text-[var(--text)]'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-actif"
                      className="absolute inset-0 -z-10 rounded-full bg-[var(--rule)]"
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}
                  {l.label}
                </>
              )}
            </NavLink>
          ))}
          <a
            href={SITE.busUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full px-4 py-2 font-medium text-muted transition-colors hover:text-[var(--text)]"
          >
            Inscription bus
          </a>
          <Link
            to="/adherer"
            className="ml-3 rounded-full bg-rouge px-5 py-2 font-semibold text-white transition-colors hover:bg-rouge-fonce"
          >
            Adhérer
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOuvert(true)}
          className="-mr-2 grid size-11 place-items-center rounded-full md:hidden"
          aria-label="Ouvrir le menu"
          aria-expanded={ouvert}
        >
          <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
            <path d="M4 8h16M4 16h10" />
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {ouvert && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black/40 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOuvert(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Menu"
              className="fixed inset-y-0 right-0 z-50 flex w-[min(86vw,360px)] flex-col bg-rouge p-6 text-white md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            >
              <button
                type="button"
                onClick={() => setOuvert(false)}
                className="-mr-2 self-end grid size-11 place-items-center rounded-full"
                aria-label="Fermer le menu"
              >
                <svg viewBox="0 0 24 24" className="size-6" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
              <nav aria-label="Navigation mobile" className="mt-6 flex flex-col">
                {[...NAV, { to: '/adherer', label: 'Adhérer' }].map((l, i) => (
                  <motion.div
                    key={l.to}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05 }}
                  >
                    <NavLink
                      to={l.to}
                      end={l.to === '/'}
                      onClick={() => setOuvert(false)}
                      className={({ isActive }) =>
                        `block py-2 font-condensed text-5xl font-[850] leading-tight ${isActive ? '' : 'text-white/65'}`
                      }
                    >
                      {l.label}
                    </NavLink>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + (NAV.length + 1) * 0.05 }}
                >
                  <a
                    href={SITE.busUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setOuvert(false)}
                    className="block py-2 font-condensed text-5xl font-[850] leading-tight text-white/65"
                  >
                    Bus <span className="text-3xl" aria-hidden="true">↗</span>
                    <span className="sr-only">: inscription aux bus (nouvel onglet)</span>
                  </a>
                </motion.div>
              </nav>
              <p className="mt-auto text-sm text-white/80">{SITE.nomLong}</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  )
}
