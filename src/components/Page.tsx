import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { SITE } from '../config'

/** Gabarit des pages fixes : grand titre condensé, contenu aligné à gauche. */
export function Page({ titre, intro, children }: { titre: string; intro?: string; children: ReactNode }) {
  useEffect(() => {
    document.title = `${titre} — ${SITE.nom}`
  }, [titre])

  return (
    <main id="contenu" className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-14">
      <h1 className="font-condensed text-[clamp(3.2rem,10vw,6.5rem)] leading-[0.88] font-[900]">{titre}</h1>
      {intro && <p className="mt-5 max-w-[56ch] text-xl text-muted">{intro}</p>}
      <div className="mt-10">{children}</div>
    </main>
  )
}
