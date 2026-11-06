import { SITE } from '../config'

/**
 * Logo officiel de l'UD (public/logo-cgt-aveyron.png).
 * En mode compact, il rétrécit par une transformation (scale) et non en changeant sa hauteur :
 * la taille de l'en-tête ne bouge pas, donc la page ne saute pas pendant le défilement.
 */
export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <img
      src="/logo-cgt-aveyron.png"
      alt={SITE.nom}
      width={292}
      height={359}
      className={`h-14 w-auto origin-left transition-[scale] duration-200 ease-sortie ${compact ? 'scale-[0.72]' : ''}`}
    />
  )
}
