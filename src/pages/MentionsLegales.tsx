import { Page } from '../components/Page'
import { SITE } from '../config'

export function MentionsLegales() {
  return (
    <Page titre="Mentions légales">
      <div className="flex max-w-[64ch] flex-col gap-8 text-lg">
        <section>
          <h2 className="font-condensed text-3xl font-[850]">Éditeur</h2>
          <p className="mt-2">{SITE.nomLong}. Adresse et directeur ou directrice de la publication à compléter.</p>
        </section>
        <section>
          <h2 className="font-condensed text-3xl font-[850]">Hébergement</h2>
          <p className="mt-2">Firebase Hosting, Google LLC.</p>
        </section>
        <section>
          <h2 className="font-condensed text-3xl font-[850]">Données personnelles</h2>
          <p className="mt-2">
            Ce site ne dépose pas de cookie publicitaire ni de traceur. Les messages envoyés par le formulaire de contact servent
            uniquement à vous répondre. Pour exercer vos droits d’accès ou de suppression, écrivez à l’UD.
          </p>
        </section>
      </div>
    </Page>
  )
}
