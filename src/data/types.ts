export type Theme = 'Mobilisation' | 'Droits' | 'Vie syndicale' | 'Formation' | 'Élections'

export const THEMES: Theme[] = ['Mobilisation', 'Droits', 'Vie syndicale', 'Formation', 'Élections']

/** Visuel provisoire en attendant les vraies photos (Firebase Storage, étape 2). */
export type Visuel = {
  /** URL d'une vraie photo ; si absente, on affiche un visuel « tract ». */
  src?: string
  legende: string
  teinte: 'rouge' | 'encre' | 'papier'
  /** Dimensions de la photo en pixels, pour réserver la bonne place sans la recadrer. */
  largeur?: number
  hauteur?: number
}

export type Publication = {
  id: string
  titre: string
  /** Date ISO (AAAA-MM-JJ ou date-heure). */
  date: string
  texte: string
  theme: Theme
  unionLocale?: string
  visuels?: Visuel[]
  epingle?: boolean
  /** Date de l'événement annoncé, pour le compte à rebours de la publication épinglée. */
  dateEvenement?: string
  lieu?: string
  source: 'site' | 'import-facebook'
  /** Lien vers la publication d'origine sur Facebook (photos, vidéo). */
  lienFacebook?: string
  lienFacebookLibelle?: string
  /** Retirée du site depuis l'administration (gardée pour pouvoir la remettre). */
  masque?: boolean
}

export type Evenement = {
  id: string
  titre: string
  /** Date ISO AAAA-MM-JJ. */
  date: string
  heure?: string
  lieu: string
  type: 'Manifestation' | 'Rassemblement' | 'Congrès' | 'Assemblée' | 'Formation' | 'Permanence'
  description?: string
  /** Publication Facebook qui annonce ou raconte le rendez-vous. */
  lienFacebook?: string
}

export type UnionLocale = {
  id: string
  nom: string
  adresse?: string
  telephone?: string
  email?: string
  permanences?: string
}
