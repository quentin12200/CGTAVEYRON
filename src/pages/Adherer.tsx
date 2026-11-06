import { Link } from 'react-router-dom'
import { Page } from '../components/Page'
import { useReglages } from '../data/reglages'

export function Adherer() {
  const SITE = useReglages()
  const RAISONS = [
    [SITE.adhererRaison1Titre, SITE.adhererRaison1Texte],
    [SITE.adhererRaison2Titre, SITE.adhererRaison2Texte],
    [SITE.adhererRaison3Titre, SITE.adhererRaison3Texte],
  ]
  return (
    <Page titre="Adhérer" intro={SITE.adhererIntro}>
      <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
        <ul className="self-start divide-y divide-[var(--rule)] border-t-4 border-[var(--text)] bg-surface px-5 sm:px-8">
          {RAISONS.map(([titre, texte]) => (
            <li key={titre} className="py-6">
              <h2 className="font-condensed text-4xl font-[850]">{titre}</h2>
              <p className="mt-2 max-w-[52ch] text-lg">{texte}</p>
            </li>
          ))}
        </ul>
        <div className="self-start bg-rouge p-7 text-white">
          <h2 className="font-condensed text-5xl leading-[0.9] font-[900]">{SITE.adhererEncartTitre}</h2>
          <p className="mt-4 text-white/85">{SITE.adhererEncartTexte}</p>
          <a
            href={SITE.adhesionUrl}
            rel="noopener"
            className="mt-6 flex h-12 items-center justify-center rounded-full bg-white font-semibold text-rouge transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Adhérer en ligne
          </a>
          <Link to="/contact" className="mt-3 flex h-12 items-center justify-center rounded-full border border-white/50 font-semibold hover:bg-white/10">
            Trouver mon union locale
          </Link>
        </div>
      </div>
    </Page>
  )
}
