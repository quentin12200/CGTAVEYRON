// Contenu du site en attendant Firestore (étape 2 de la feuille de route).
// Publications : vraies publications de la page Facebook de l'UD (voir facebook.ts).
import type { Evenement, UnionLocale } from './types'
import { publicationsFacebook } from './facebook'

export const DEMO = false

export const publications = publicationsFacebook

// Rendez-vous réels uniquement, tirés des publications Facebook de l'UD : pas de date inventée.
// Pas d'heure quand la publication n'en donne pas.
export const evenements: Evenement[] = [
  {
    id: 'mobilisation-5-novembre',
    titre: 'Journée nationale de grève et de manifestations',
    date: '2026-11-05',
    heure: '14 h 30',
    lieu: 'Rodez, jardin public',
    type: 'Manifestation',
    description: 'Pour l’augmentation du SMIC, des salaires, du point d’indice et des pensions. Près de 5 000 personnes dans les rues de Rodez.',
    lienFacebook: 'https://www.facebook.com/udcgt.aveyron/posts/pfbid02vmp9ZL3hakv8tBR49aQtugRYrvx5WUtaDRM2GjS7THPs113gqVFysgnWJk7ssiSwl',
  },
  {
    id: 'vie-chere-31-octobre',
    titre: 'Initiatives citoyennes contre la vie chère',
    date: '2026-10-31',
    lieu: 'Rodez et Villefranche-de-Rouergue',
    type: 'Rassemblement',
    lienFacebook: 'https://www.facebook.com/udcgt.aveyron/posts/pfbid02gjsTWr1QSji9jWBsBZebg1aLWWfJhgYY4TVz26TwXEjY8HjuAmoNGJaimg7adnqxl',
  },
  {
    id: 'hommage-trappes',
    titre: 'Hommage aux victimes de l’attentat raciste de Trappes',
    date: '2026-10-27',
    lieu: 'Rodez, Millau, Villefranche-de-Rouergue, Saint-Affrique',
    type: 'Rassemblement',
    lienFacebook: 'https://www.facebook.com/udcgt.aveyron/posts/pfbid02o8kMX763BogSkHtAq3S9tGYQKJYjS2tZMN6RA2hBt6UpH4gHEQu59tNVP2wd4dvjl',
  },
  {
    id: 'vie-chere-24-octobre',
    titre: 'Mobilisation citoyenne contre la vie chère',
    date: '2026-10-24',
    lieu: 'Aveyron',
    type: 'Rassemblement',
    lienFacebook: 'https://www.facebook.com/udcgt.aveyron/posts/pfbid02m7M71EkKBzve3vGnikDzqqC4YJTBp9d2jtMwLKQnqSjiuAXqyGqgc8XA1QZrV8o3l',
  },
  {
    id: 'vie-chere-17-octobre',
    titre: 'Mobilisation citoyenne contre la vie chère',
    date: '2026-10-17',
    lieu: 'Rodez, Millau, Villefranche-de-Rouergue, Decazeville',
    type: 'Rassemblement',
    lienFacebook: 'https://www.facebook.com/udcgt.aveyron/posts/pfbid02cgXHa6Z5optvmugNjoQudEpzGm7Dq36AhC3invWK2AeMGCRbS6kUBjgd5R2mVTXRl',
  },
  {
    id: 'congres-usr',
    titre: 'Congrès de l’Union syndicale des retraité-e-s CGT de l’Aveyron',
    date: '2026-10-15',
    lieu: 'Onet-le-Château',
    type: 'Congrès',
    description: 'Bruno Giuliani élu secrétaire général.',
    lienFacebook: 'https://www.facebook.com/udcgt.aveyron/posts/pfbid0hVfXVLZC9m8Mae4XX8Nuj3TPDJbbTheimAyY5QLMHq1waRn3f6GZXfswELfUin9Ll',
  },
]

// Coordonnées à compléter : rien n'est inventé ici.
export const unionsLocales: UnionLocale[] = [
  { id: 'ud', nom: 'Union départementale CGT de l’Aveyron' },
  { id: 'villefranche', nom: 'Union locale de Villefranche-de-Rouergue' },
]
