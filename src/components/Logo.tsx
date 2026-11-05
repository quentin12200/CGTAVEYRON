import { SITE } from '../config'

/** Logo officiel de l'UD (public/logo-cgt-aveyron.png). */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src="/logo-cgt-aveyron.png"
      alt={SITE.nom}
      width={292}
      height={359}
      className={`w-auto transition-[height] duration-300 ${compact ? 'h-10' : 'h-14'}`}
    />
  )
}
