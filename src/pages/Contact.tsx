import { useState, type FormEvent } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useUnionsLocales } from '../data/unions'
import { Page } from '../components/Page'
import { useReglages } from '../data/reglages'

const champ =
  'mt-1.5 w-full rounded-sm border-2 border-rule bg-surface px-4 py-3 text-base outline-none transition-[border-color,box-shadow] focus:border-rouge focus:ring-4 focus:ring-rouge/15'

export function Contact() {
  const SITE = useReglages()
  const unionsLocales = useUnionsLocales()
  const [envoye, setEnvoye] = useState(false)

  // En attendant l'étape 5 (Firestore + e-mail automatique), le message s'ouvre
  // dans la messagerie du visiteur, déjà adressé à l'UD.
  const envoyer = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const champ = (n: string) => String(d.get(n) ?? '').trim()
    const corps = [
      champ('message'),
      '',
      `Nom : ${champ('nom')}`,
      `Contact : ${champ('contact')}`,
      champ('entreprise') && `Entreprise ou ville : ${champ('entreprise')}`,
    ]
      .filter((l) => l !== '')
      .join('\n')
    const sujet = `Message depuis le site : ${champ('nom')}`
    window.location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`
    setEnvoye(true)
  }

  return (
    <Page titre="Contact" intro={SITE.contactIntro}>
      <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-16">
        <section aria-labelledby="titre-ul">
          <h2 id="titre-ul" className="font-condensed text-3xl font-[850]">Nous trouver</h2>
          <ul className="mt-4 divide-y divide-[var(--rule)] border-t-4 border-[var(--text)] bg-surface px-5 sm:px-7">
            {unionsLocales.map((ul) => (
              <li key={ul.id} className="py-5">
                <p className="text-xl font-semibold">{ul.nom}</p>
                {ul.adresse || ul.telephone || ul.email || ul.permanences ? (
                  <div className="mt-1 text-muted">
                    {ul.adresse && <p className="whitespace-pre-line">{ul.adresse}</p>}
                    {ul.telephone && (
                      // Plusieurs numéros possibles, séparés par « / » : un lien d'appel chacun.
                      <p className="flex flex-wrap gap-x-3">
                        {ul.telephone.split('/').map((t) => t.trim()).filter(Boolean).map((t) => (
                          <a key={t} href={`tel:${t.replace(/[^\d+]/g, '')}`} className="hover:text-rouge-texte">
                            {t}
                          </a>
                        ))}
                      </p>
                    )}
                    {ul.email && <p><a href={`mailto:${ul.email}`} className="hover:text-rouge-texte">{ul.email}</a></p>}
                    {ul.permanences && <p className="whitespace-pre-line">{ul.permanences}</p>}
                    {ul.adresse && (
                      <a
                        href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(ul.adresse.replace(/\n/g, ', '))}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block font-semibold text-rouge-texte hover:underline"
                      >
                        Voir sur la carte
                      </a>
                    )}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
          <div className="mt-6 overflow-hidden border-2 border-rule">
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
          <p className="mt-2 text-lg">
            Par e-mail :{' '}
            <a href={`mailto:${SITE.email}`} className="font-semibold text-rouge-texte hover:underline">
              {SITE.email}
            </a>
          </p>
          <AnimatePresence mode="wait">
            {envoye ? (
              <motion.div
                key="ok"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 border-t-4 border-[var(--text)] bg-surface p-7"
                role="status"
              >
                <p className="font-condensed text-4xl font-[850] text-rouge-texte">Message prêt</p>
                <p className="mt-2 text-muted">
                  Votre messagerie s’est ouverte avec le message rempli. Appuyez sur « Envoyer » pour l’adresser à {SITE.email}.
                  Rien ne s’est ouvert ? Écrivez directement à{' '}
                  <a href={`mailto:${SITE.email}`} className="font-semibold text-rouge-texte underline">{SITE.email}</a>.
                </p>
                <button type="button" onClick={() => setEnvoye(false)} className="mt-4 font-semibold text-rouge-texte underline">
                  Écrire un autre message
                </button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={envoyer} className="mt-4 flex flex-col gap-5 border-t-4 border-[var(--text)] bg-surface p-5 sm:p-7" exit={{ opacity: 0, transition: { duration: 0.15 } }}>
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
                  Le bouton ouvre votre messagerie avec le message prêt à partir. Vos coordonnées servent uniquement à vous répondre : elles ne sont ni conservées sur le site ni transmises.
                </p>
                <button
                  type="submit"
                  className="h-12 self-start rounded-full bg-rouge px-7 font-semibold text-white appui hover:bg-rouge-fonce"
                >
                  Préparer l’e-mail
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </section>
      </div>
    </Page>
  )
}
