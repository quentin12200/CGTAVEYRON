import type { Visuel as V } from '../data/types'

const TEINTES: Record<V['teinte'], { fond: string; texte: string; trait: string }> = {
  rouge: { fond: 'var(--color-rouge)', texte: '#ffffff', trait: 'rgba(255,255,255,.18)' },
  encre: { fond: 'var(--color-encre)', texte: '#ffffff', trait: 'rgba(210,0,18,.9)' },
  papier: { fond: '#ecebe7', texte: 'var(--color-encre)', trait: 'rgba(210,0,18,.85)' },
}

/**
 * Affiche la photo entière, jamais recadrée : si elle n'a pas la forme du cadre,
 * le reste est rempli par la même photo floutée. À défaut de photo, un visuel façon tract.
 */
export function Visuel({ visuel, className = '' }: { visuel: V; className?: string }) {
  if (visuel.src) {
    return (
      <div className={`relative size-full overflow-hidden bg-encre ${className}`}>
        <img
          src={visuel.src}
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 size-full scale-110 object-cover opacity-70 blur-2xl"
        />
        <img
          src={visuel.src}
          alt={visuel.legende}
          loading="lazy"
          width={visuel.largeur}
          height={visuel.hauteur}
          className="relative size-full object-contain"
        />
      </div>
    )
  }
  const t = TEINTES[visuel.teinte]
  return (
    <div
      role="img"
      aria-label={visuel.legende}
      className={`relative flex size-full items-end overflow-hidden p-5 ${className}`}
      style={{ background: t.fond, color: t.texte }}
    >
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden="true">
        <path d="M-10 92 L110 20" stroke={t.trait} strokeWidth="14" />
      </svg>
      <span className="relative font-condensed text-[clamp(2.2rem,9vw,4rem)] leading-[0.9] font-[900] text-balance">
        {visuel.legende}
      </span>
    </div>
  )
}
