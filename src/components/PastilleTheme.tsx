import type { Theme } from '../data/types'

/** Pastille de thème : un petit carré rouge, le nom en clair. */
export function PastilleTheme({ theme, claire = false }: { theme: Theme; claire?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-2 text-[0.95rem] font-semibold ${claire ? 'text-white' : ''}`}>
      <span className={`size-2.5 rounded-[3px] ${claire ? 'bg-white' : 'bg-rouge'}`} aria-hidden="true" />
      {theme}
    </span>
  )
}
