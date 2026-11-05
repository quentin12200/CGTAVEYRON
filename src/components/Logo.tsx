import { SITE } from '../config'

/**
 * Marque provisoire. Remplacer le carré par le logo officiel de l'UD
 * (fichier fourni par l'UD, à déposer dans /public).
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 64 64"
        aria-hidden="true"
        className={`shrink-0 transition-all duration-300 ${compact ? 'size-8' : 'size-10'}`}
      >
        <rect width="64" height="64" rx="12" fill="var(--color-rouge)" />
        <path d="M14 44 L50 20" stroke="#fff" strokeWidth="8" strokeLinecap="round" />
      </svg>
      <span className="font-condensed text-[1.45rem] leading-none font-[800] tracking-tight">
        {SITE.nom}
      </span>
    </span>
  )
}
