import { useState } from 'react'

/**
 * Vignette d'une vidéo YouTube citée dans une publication.
 * Rien n'est chargé depuis YouTube avant le geste du visiteur, à part l'image de la vignette :
 * au toucher, la vidéo se lance ici, en mode « sans cookie » (youtube-nocookie.com).
 */
export function VideoYoutube({ id, titre }: { id: string; titre: string }) {
  const [lancee, setLancee] = useState(false)
  // La plus grande vignette n'existe pas pour toutes les vidéos : on retombe sur la moyenne.
  const [image, setImage] = useState(`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`)

  if (lancee) {
    return (
      <div className="aspect-video bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={`Vidéo : ${titre}`}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          className="size-full"
        />
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setLancee(true)}
      className="group relative block aspect-video w-full overflow-hidden bg-black"
      aria-label={`Lire la vidéo YouTube : ${titre}`}
    >
      <img
        src={image}
        alt=""
        loading="lazy"
        onLoad={(e) => {
          // YouTube renvoie une petite image grise de 120 px quand la grande vignette n'existe pas.
          if (e.currentTarget.naturalWidth <= 120 && !image.includes('hqdefault'))
            setImage(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)
        }}
        onError={() => setImage(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`)}
        className="size-full object-cover"
      />
      <span className="absolute inset-0 grid place-items-center bg-black/10 transition-colors group-hover:bg-black/25">
        <span className="grid size-16 place-items-center rounded-full bg-rouge text-white shadow-lg transition-transform group-hover:scale-105 sm:size-20">
          <svg viewBox="0 0 24 24" className="ml-1 size-8 sm:size-9" fill="currentColor" aria-hidden="true">
            <path d="M8 5.5v13l11-6.5z" />
          </svg>
        </span>
      </span>
      <span className="absolute bottom-3 left-3 rounded-sm bg-black/70 px-2 py-1 text-sm font-semibold text-white">
        Vidéo YouTube
      </span>
    </button>
  )
}
