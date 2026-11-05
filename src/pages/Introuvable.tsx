import { Link } from 'react-router-dom'
import { Page } from '../components/Page'

export function Introuvable() {
  return (
    <Page titre="Page introuvable" intro="Cette adresse ne correspond à aucune page. La publication a peut-être été retirée.">
      <Link to="/" className="inline-flex h-12 items-center rounded-full bg-rouge px-6 font-semibold text-white hover:bg-rouge-fonce">
        Retour aux actualités
      </Link>
    </Page>
  )
}
