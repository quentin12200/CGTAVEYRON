import { evenements } from '../data/demo'
import { Page } from '../components/Page'
import { formatJourSemaine, formatMois, numeroJour } from '../lib/format'
import { DEMO } from '../data/demo'

export function Agenda() {
  const parMois = new Map<string, typeof evenements>()
  for (const e of [...evenements].sort((a, b) => a.date.localeCompare(b.date))) {
    const cle = formatMois(e.date)
    parMois.set(cle, [...(parMois.get(cle) ?? []), e])
  }

  return (
    <Page
      titre="Agenda"
      intro="Manifestations, assemblées, formations et permanences dans le département."
    >
      {DEMO && <p className="-mt-4 mb-8 text-sm text-muted">Dates de démonstration.</p>}
      <div className="flex flex-col gap-12">
        {[...parMois].map(([mois, liste]) => (
          <section key={mois} aria-label={mois}>
            <h2 className="font-condensed text-3xl font-[850] first-letter:uppercase">{mois}</h2>
            <ol className="mt-4 divide-y divide-[var(--rule)] border-y border-rule">
              {liste.map((e) => (
                <li key={e.id} className="grid grid-cols-[4.5rem_1fr] gap-4 py-5 sm:grid-cols-[6rem_1fr_auto] sm:items-center">
                  <div>
                    <div className="font-condensed text-6xl leading-[0.85] font-[900] text-rouge">{numeroJour(e.date)}</div>
                    <div className="mt-1 text-sm text-muted first-letter:uppercase">{formatJourSemaine(e.date)}</div>
                  </div>
                  <div>
                    <p className="text-xl font-semibold leading-snug">{e.titre}</p>
                    <p className="mt-1 text-muted">
                      {e.heure}, {e.lieu}
                    </p>
                  </div>
                  <span className="col-start-2 justify-self-start rounded-full border border-rule px-3 py-1 text-sm font-semibold sm:col-start-auto">
                    {e.type}
                  </span>
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </Page>
  )
}
