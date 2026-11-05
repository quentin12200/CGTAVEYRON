import { Link } from 'react-router-dom'
import { Page } from '../components/Page'
import { SITE } from '../config'

const RAISONS = [
  ['Être informé', 'Connaître vos droits, votre convention collective, ce qui se décide dans votre entreprise.'],
  ['Être défendu', 'Un collectif et des militants formés à vos côtés en cas de problème avec l’employeur.'],
  ['Peser ensemble', 'Plus nous sommes nombreux, plus nous obtenons sur les salaires et les conditions de travail.'],
]

export function Adherer() {
  return (
    <Page titre="Adhérer" intro="Se syndiquer, c’est ne plus être seul au travail. La cotisation ouvre droit à un crédit d’impôt de 66 %.">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-16">
        <ul className="flex flex-col gap-8">
          {RAISONS.map(([titre, texte]) => (
            <li key={titre} className="border-l-4 border-rouge pl-5">
              <h2 className="font-condensed text-4xl font-[850]">{titre}</h2>
              <p className="mt-2 max-w-[52ch] text-lg text-muted">{texte}</p>
            </li>
          ))}
        </ul>
        <div className="self-start rounded-2xl bg-rouge p-7 text-white">
          <h2 className="font-condensed text-5xl leading-[0.9] font-[900]">Rejoindre la CGT</h2>
          <p className="mt-4 text-white/85">En ligne en quelques minutes, ou auprès de votre union locale.</p>
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
