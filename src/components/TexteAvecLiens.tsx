import { Fragment } from 'react'
import { MOTIF_LIEN, nettoyerLien } from '../lib/liens'

/** Texte d'une publication dont les adresses web deviennent des liens cliquables. */
export function TexteAvecLiens({ texte }: { texte: string }) {
  const morceaux = texte.split(MOTIF_LIEN)
  return (
    <>
      {morceaux.map((m, i) => {
        if (i % 2 === 0) return <Fragment key={i}>{m}</Fragment>
        const lien = nettoyerLien(m)
        const reste = m.slice(lien.length)
        return (
          <Fragment key={i}>
            <a
              href={lien.startsWith('http') ? lien : `https://${lien}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold break-all text-rouge-texte underline underline-offset-2"
            >
              {lien.replace(/^https?:\/\/(www\.)?/, '')}
            </a>
            {reste}
          </Fragment>
        )
      })}
    </>
  )
}
