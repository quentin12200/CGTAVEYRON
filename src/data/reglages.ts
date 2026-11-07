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

  mentionsEditeur: `${SITE.nomLong} (union de syndicats).`,
  mentionsAdresse: '',
  mentionsTelephone: '',
  mentionsDirecteur: '',
  mentionsHebergement:
    'Firebase Hosting, service de Google LLC, 1600 Amphitheatre Parkway, Mountain View, CA 94043, États-Unis (+1 650 253 0000). Les contenus du site (publications, photos, agenda) sont stockés sur Google Cloud (Cloud Firestore et Cloud Storage).',
  mentionsDonnees: `Responsable du traitement : ${SITE.nomLong}.

Ce que le site enregistre :
• Bouton « Je soutiens » : un identifiant anonyme attribué à votre appareil par Firebase et les publications que vous soutenez. Ni nom, ni adresse e-mail. Il sert à compter un soutien par personne.
• Formulaire de contact : il ouvre votre propre messagerie ; le site ne garde rien. L'UD reçoit votre message par e-mail et s'en sert uniquement pour vous répondre.
• Administration : l'adresse Google des personnes chargées de publier, pour vérifier leurs droits.

Le site ne mesure pas l'audience et ne dépose aucun cookie publicitaire.

Base légale : l'intérêt légitime de l'UD à informer le public et à lui répondre ; pour le contact, votre propre démarche.

Données sensibles : un message adressé à un syndicat peut révéler une appartenance ou une sympathie syndicale. L'UD traite ces messages de façon confidentielle et ne les transmet à personne.

Hébergement des données : Google (Firebase), sous-traitant de l'UD. Google LLC adhère au cadre de protection des données UE–États-Unis (Data Privacy Framework).

Durée de conservation : les soutiens restent tant que la publication est en ligne ; les e-mails, le temps nécessaire au suivi de votre demande.`,
  mentionsCookies:
    "Le site ne dépose aucun cookie de mesure d'audience ni de publicité. Il utilise le stockage de votre navigateur uniquement pour ce que vous déclenchez vous-même : mémoriser vos soutiens et, après votre premier soutien, l'identifiant anonyme Firebase. Ces usages techniques ne demandent pas de consentement.\n\nLes vidéos YouTube ne se chargent que si vous les lancez, en mode « sans cookie » ; avant, seule leur image d'aperçu est affichée. La carte de la page Contact et les liens « Voir sur la carte » viennent d'OpenStreetMap.",
  mentionsDroits:
    "Vous pouvez accéder à vos données, les faire rectifier ou effacer, vous opposer à leur traitement ou en demander la limitation, en écrivant à {email}. Pour effacer vos soutiens, effacez les données de ce site dans votre navigateur, ou écrivez-nous.\n\nSi vous estimez que vos droits ne sont pas respectés, vous pouvez adresser une réclamation à la CNIL : https://www.cnil.fr",
  mentionsPropriete:
    "Les textes, photos et visuels de ce site appartiennent à l'UD CGT de l'Aveyron ou à leurs auteurs ; toute reprise doit citer la source. Le nom et le logo CGT sont des marques de la Confédération générale du travail.\n\nDroit à l'image : une personne qui figure sur une photo et souhaite son retrait peut le demander à {email}. La photo sera retirée rapidement.",
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
      { cle: 'mentionsEditeur', label: 'Éditeur (nom et forme juridique)', type: 'long' },
      { cle: 'mentionsAdresse', label: 'Adresse du siège (obligatoire par la loi)', type: 'long' },
      { cle: 'mentionsTelephone', label: 'Téléphone de l’UD (obligatoire par la loi)' },
      { cle: 'mentionsDirecteur', label: 'Directeur ou directrice de la publication (obligatoire par la loi)' },
      { cle: 'mentionsHebergement', label: 'Hébergement', type: 'long' },
      { cle: 'mentionsDonnees', label: 'Données personnelles', type: 'long' },
      { cle: 'mentionsCookies', label: 'Cookies et stockage', type: 'long' },
      { cle: 'mentionsDroits', label: 'Vos droits ({email} = e-mail public)', type: 'long' },
      { cle: 'mentionsPropriete', label: 'Propriété intellectuelle et droit à l’image ({email} = e-mail public)', type: 'long' },
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
