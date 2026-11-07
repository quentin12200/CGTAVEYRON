import type { ReactNode } from 'react'
import { Page } from '../components/Page'
import { TexteAvecLiens } from '../components/TexteAvecLiens'
import { useReglages } from '../data/reglages'

/** Une rubrique des mentions légales, sur la feuille commune. */
function Rubrique({ titre, children }: { titre: string; children: ReactNode }) {
  return (
    <section className="py-7">
      <h2 className="font-condensed text-3xl font-[850]">{titre}</h2>
      <div className="mt-3 flex flex-col gap-1">{children}</div>
    </section>
  )
}

/** Texte modifiable depuis /admin : liens cliquables, {email} remplacé par l'adresse publique. */
function Texte({ texte, email }: { texte: string; email: string }) {
  return (
    <p className="max-w-[68ch] whitespace-pre-line">
      <TexteAvecLiens texte={texte.replaceAll('{email}', email)} />
    </p>
  )
}

/**
 * Mentions légales (loi pour la confiance dans l'économie numérique, art. 6-III) et informations RGPD.
 * Les champs obligatoires laissés vides ne s'affichent pas (rien « à compléter » au public) :
 * l'audit et l'administration les signalent.
 */
export function MentionsLegales() {
  const SITE = useReglages()
  return (
    <Page titre="Mentions légales">
      <div className="max-w-3xl divide-y divide-[var(--rule)] border-t-4 border-[var(--text)] bg-surface px-5 text-lg sm:px-8">
        <Rubrique titre="Éditeur">
          <Texte texte={SITE.mentionsEditeur} email={SITE.email} />
          {SITE.mentionsAdresse && <Texte texte={SITE.mentionsAdresse} email={SITE.email} />}
          {SITE.mentionsTelephone && (
            <p>
              Téléphone :{' '}
              <a href={`tel:${SITE.mentionsTelephone.replace(/[^\d+]/g, '')}`} className="font-semibold text-rouge-texte underline">
                {SITE.mentionsTelephone}
              </a>
            </p>
          )}
          <p>
            E-mail :{' '}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-rouge-texte underline">
              {SITE.email}
            </a>
          </p>
          {SITE.mentionsDirecteur && <p>Directeur ou directrice de la publication : {SITE.mentionsDirecteur}</p>}
        </Rubrique>
        <Rubrique titre="Hébergement">
          <Texte texte={SITE.mentionsHebergement} email={SITE.email} />
        </Rubrique>
        <Rubrique titre="Données personnelles">
          <Texte texte={SITE.mentionsDonnees} email={SITE.email} />
        </Rubrique>
        <Rubrique titre="Cookies et stockage">
          <Texte texte={SITE.mentionsCookies} email={SITE.email} />
        </Rubrique>
        <Rubrique titre="Vos droits">
          <Texte texte={SITE.mentionsDroits} email={SITE.email} />
        </Rubrique>
        <Rubrique titre="Propriété intellectuelle et droit à l’image">
          <Texte texte={SITE.mentionsPropriete} email={SITE.email} />
        </Rubrique>
      </div>
    </Page>
  )
}
