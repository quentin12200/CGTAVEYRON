import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { unionsLocales } from '../data/demo'
import { Page } from '../components/Page'

const champ =
  'mt-1.5 w-full rounded-xl border border-rule bg-surface px-4 py-3 text-base outline-none transition-[border-color,box-shadow] focus:border-rouge focus:ring-4 focus:ring-rouge/15'

export function Contact() {
  const [envoye, setEnvoye] = useState(false)

  const envoyer = (e: FormEvent) => {
    e.preventDefault()
    // TODO étape 5 : enregistrer dans Firestore + extension Trigger Email.
    setEnvoye(true)
  }

  return (
    <Page titre="Contact" intro="L’Union départementale et les unions locales vous accueillent, syndiqué ou non.">
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <section aria-labelledby="titre-ul">
          <h2 id="titre-ul" className="font-condensed text-3xl font-[850]">Nous trouver</h2>
          <ul className="mt-4 divide-y divide-[var(--rule)] border-y border-rule">
            {unionsLocales.map((ul) => (
              <li key={ul.id} className="py-5">
                <p className="text-xl font-semibold">{ul.nom}</p>
                {ul.adresse || ul.telephone || ul.permanences ? (
                  <div className="mt-1 text-muted">
                    {ul.adresse && <p>{ul.adresse}</p>}
                    {ul.telephone && <p><a href={`tel:${ul.telephone}`} className="hover:text-rouge">{ul.telephone}</a></p>}
                    {ul.permanences && <p>{ul.permanences}</p>}
                  </div>
                ) : (
                  <p className="mt-1 text-muted">Adresse, téléphone et permanences à compléter.</p>
                )}
              </li>
            ))}
          </ul>
          <div className="mt-6 overflow-hidden rounded-2xl border border-rule">
            <iframe
              title="Carte de l’Aveyron"
              className="aspect-[4/3] w-full grayscale-[35%]"
              loading="lazy"
              src="https://www.openstreetmap.org/export/embed.html?bbox=1.80%2C43.70%2C3.45%2C44.95&layer=mapnik"
            />
          </div>
        </section>

        <section aria-labelledby="titre-ecrire">
          <h2 id="titre-ecrire" className="font-condensed text-3xl font-[850]">Nous écrire</h2>
          <AnimatePresence mode="wait">
            {envoye ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 rounded-2xl bg-surface p-7"
                role="status"
              >
                <p className="font-condensed text-4xl font-[850] text-rouge">Message prêt</p>
                <p className="mt-2 text-muted">
                  Version de démonstration : l’envoi par e-mail à l’UD sera branché à l’étape 5. Rien n’a été envoyé.
                </p>
                <button type="button" onClick={() => setEnvoye(false)} className="mt-4 font-semibold text-rouge underline">
                  Écrire un autre message
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={envoyer} className="mt-4 flex flex-col gap-5" exit={{ opacity: 0 }}>
                <label className="font-semibold">
                  Nom
                  <input required name="nom" autoComplete="name" className={champ} />
                </label>
                <label className="font-semibold">
                  E-mail ou téléphone
                  <input required name="contact" autoComplete="email" className={champ} />
                </label>
                <label className="font-semibold">
                  Entreprise ou ville <span className="font-normal text-muted">(facultatif)</span>
                  <input name="entreprise" className={champ} />
                </label>
                <label className="font-semibold">
                  Votre message
                  <textarea required name="message" rows={6} className={champ} />
                </label>
                <p className="text-sm text-muted">
                  Vos coordonnées servent uniquement à vous répondre. Elles ne sont ni conservées sur le site ni transmises.
                </p>
                <button
                  type="submit"
                  className="h-12 self-start rounded-full bg-rouge px-7 font-semibold text-white transition-colors hover:bg-rouge-fonce"
                >
                  Envoyer le message
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </section>
      </div>
    </Page>
  )
}
