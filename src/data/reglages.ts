// Liens et textes du site, modifiables depuis /admin (document Firestore « reglages/site »).
// Les valeurs ci-dessous servent tant que rien n'a été modifié en ligne.
import { useSyncExternalStore } from 'react'
import { SITE } from '../config'

export const REGLAGES_DEFAUT = {
  nomLong: SITE.nomLong,
  email: SITE.email,
  adhesionUrl: SITE.adhesionUrl,
  busUrl: SITE.busUrl,
  facebookUrl: SITE.facebookUrl,

  accueilTitreFil: 'Dernières publications',
  accueilEncartTitre: 'Seul on subit, ensemble on agit',
  accueilEncartTexte: 'Adhérer à la CGT, c’est être informé, défendu et ne plus être seul face à l’employeur.',
  accueilAideTitre: 'Besoin d’aide ?',
  accueilAideTexte: 'Trouvez l’union locale la plus proche et ses permanences.',

  adhererIntro: 'Se syndiquer, c’est ne plus être seul au travail. La cotisation ouvre droit à un crédit d’impôt de 66 %.',
  adhererRaison1Titre: 'Être informé',
  adhererRaison1Texte: 'Connaître vos droits, votre convention collective, ce qui se décide dans votre entreprise.',
  adhererRaison2Titre: 'Être défendu',
  adhererRaison2Texte: 'Un collectif et des militants formés à vos côtés en cas de problème avec l’employeur.',
  adhererRaison3Titre: 'Peser ensemble',
  adhererRaison3Texte: 'Plus nous sommes nombreux, plus nous obtenons sur les salaires et les conditions de travail.',
  adhererEncartTitre: 'Rejoindre la CGT',
  adhererEncartTexte: 'En ligne, ou auprès de votre union locale.',

  contactIntro: 'L’Union départementale et les unions locales vous accueillent, syndiqué ou non.',
  agendaIntro: 'Manifestations, rassemblements, congrès et permanences de la CGT dans le département.',

  mentionsEditeur: `${SITE.nomLong}. Adresse et directeur ou directrice de la publication à compléter.`,
  mentionsHebergement: 'Firebase Hosting, Google LLC.',
  mentionsDonnees:
    'Ce site ne dépose pas de cookie publicitaire ni de traceur. Les messages envoyés par le formulaire de contact servent uniquement à vous répondre. Pour exercer vos droits d’accès ou de suppression, écrivez à l’UD.',
}

export type Reglages = typeof REGLAGES_DEFAUT
export type CleReglage = keyof Reglages

/** Champs proposés dans l'onglet « Site » de l'administration, par rubrique. */
export const RUBRIQUES: { titre: string; champs: { cle: CleReglage; label: string; type?: 'lien' | 'email' | 'long' }[] }[] = [
  {
    titre: 'Liens et coordonnées',
    champs: [
      { cle: 'nomLong', label: 'Nom de l’organisation' },
      { cle: 'email', label: 'E-mail public de contact', type: 'email' },
      { cle: 'adhesionUrl', label: 'Lien « Adhérer en ligne »', type: 'lien' },
      { cle: 'busUrl', label: 'Lien « Inscription bus »', type: 'lien' },
      { cle: 'facebookUrl', label: 'Page Facebook', type: 'lien' },
    ],
  },
  {
    titre: 'Accueil',
    champs: [
      { cle: 'accueilTitreFil', label: 'Titre du fil' },
      { cle: 'accueilEncartTitre', label: 'Encadré noir : titre' },
      { cle: 'accueilEncartTexte', label: 'Encadré noir : texte', type: 'long' },
      { cle: 'accueilAideTitre', label: 'Encadré « aide » : titre' },
      { cle: 'accueilAideTexte', label: 'Encadré « aide » : texte', type: 'long' },
    ],
  },
  {
    titre: 'Page Adhérer',
    champs: [
      { cle: 'adhererIntro', label: 'Introduction', type: 'long' },
      { cle: 'adhererRaison1Titre', label: 'Raison 1 : titre' },
      { cle: 'adhererRaison1Texte', label: 'Raison 1 : texte', type: 'long' },
      { cle: 'adhererRaison2Titre', label: 'Raison 2 : titre' },
      { cle: 'adhererRaison2Texte', label: 'Raison 2 : texte', type: 'long' },
      { cle: 'adhererRaison3Titre', label: 'Raison 3 : titre' },
      { cle: 'adhererRaison3Texte', label: 'Raison 3 : texte', type: 'long' },
      { cle: 'adhererEncartTitre', label: 'Encadré rouge : titre' },
      { cle: 'adhererEncartTexte', label: 'Encadré rouge : texte', type: 'long' },
    ],
  },
  {
    titre: 'Pages Contact et Agenda',
    champs: [
      { cle: 'contactIntro', label: 'Contact : introduction', type: 'long' },
      { cle: 'agendaIntro', label: 'Agenda : introduction', type: 'long' },
    ],
  },
  {
    titre: 'Mentions légales',
    champs: [
      { cle: 'mentionsEditeur', label: 'Éditeur (adresse, responsable de la publication)', type: 'long' },
      { cle: 'mentionsHebergement', label: 'Hébergement', type: 'long' },
      { cle: 'mentionsDonnees', label: 'Données personnelles', type: 'long' },
    ],
  },
]

let actuels: Reglages = REGLAGES_DEFAUT
const abonnes = new Set<() => void>()
let demarre = false

function demarrer() {
  if (demarre) return
  demarre = true
  void import('../lib/firebase').then(async ({ services }) => {
    const s = await services()
    if (!s) return
    const { doc, onSnapshot } = await import('firebase/firestore')
    onSnapshot(
      doc(s.db, 'reglages', 'site'),
      (snap) => {
        const enLigne = (snap.data() ?? {}) as Partial<Reglages>
        // Un champ vidé en ligne reprend sa valeur par défaut.
        const propres = Object.fromEntries(Object.entries(enLigne).filter(([, v]) => typeof v === 'string' && v.trim()))
        actuels = { ...REGLAGES_DEFAUT, ...propres }
        for (const f of abonnes) f()
      },
      (err) => console.warn('Réglages en ligne indisponibles :', err.message),
    )
  })
}

function abonner(f: () => void) {
  demarrer()
  abonnes.add(f)
  return () => {
    abonnes.delete(f)
  }
}

/** Liens et textes du site, à jour en direct. */
export function useReglages(): Reglages {
  return useSyncExternalStore(abonner, () => actuels)
}
