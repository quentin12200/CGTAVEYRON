import { Page } from '../components/Page'
import { useReglages } from '../data/reglages'

export function MentionsLegales() {
  const SITE = useReglages()
  return (
    <Page titre="Mentions légales">
      <div className="flex max-w-[64ch] flex-col gap-8 text-lg">
        <section>
          <h2 className="font-condensed text-3xl font-[850]">Éditeur</h2>
          <p className="mt-2 whitespace-pre-line">{SITE.mentionsEditeur}</p>
        </section>
        <section>
          <h2 className="font-condensed text-3xl font-[850]">Hébergement</h2>
          <p className="mt-2 whitespace-pre-line">{SITE.mentionsHebergement}</p>
        </section>
        <section>
          <h2 className="font-condensed text-3xl font-[850]">Données personnelles</h2>
          <p className="mt-2 whitespace-pre-line">{SITE.mentionsDonnees}</p>
        </section>
      </div>
    </Page>
  )
}
