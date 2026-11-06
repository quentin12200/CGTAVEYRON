// Liens écrits dans le texte des publications : repérage des adresses et des vidéos YouTube.

/** Adresses web dans un texte (http, https ou www.). */
export const MOTIF_LIEN = /(https?:\/\/[^\s<]+|www\.[^\s<]+)/gi

/** Retire la ponctuation collée à la fin d'une adresse (« voir https://… ! »). */
export function nettoyerLien(brut: string): string {
  return brut.replace(/[).,;:!?»"']+$/, '')
}

/** Identifiant d'une vidéo YouTube à partir de son adresse, ou null. */
export function idYoutube(adresse: string): string | null {
  let url: URL
  try {
    url = new URL(adresse.startsWith('http') ? adresse : `https://${adresse}`)
  } catch {
    return null
  }
  const hote = url.hostname.replace(/^(www\.|m\.|music\.)/, '')
  let id: string | null = null
  if (hote === 'youtu.be') id = url.pathname.slice(1).split('/')[0]
  else if (hote === 'youtube.com' || hote === 'youtube-nocookie.com') {
    if (url.pathname === '/watch') id = url.searchParams.get('v')
    else {
      const m = url.pathname.match(/^\/(?:shorts|live|embed|v)\/([^/?#]+)/)
      id = m?.[1] ?? null
    }
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null
}

/** Vidéos YouTube citées dans les textes donnés, sans doublon, dans l'ordre. */
export function videosYoutube(...textes: (string | undefined)[]): string[] {
  const ids: string[] = []
  for (const t of textes) {
    for (const brut of t?.match(MOTIF_LIEN) ?? []) {
      const id = idYoutube(nettoyerLien(brut))
      if (id && !ids.includes(id)) ids.push(id)
    }
  }
  return ids
}
