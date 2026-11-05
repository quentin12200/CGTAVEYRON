// CONTENU DE DÉMONSTRATION — à remplacer par Firestore (étape 2 de la feuille de route).
// Sauf la publication épinglée et l'agenda (réels, sourcés), les publications ci-dessous sont des exemples.
import type { Evenement, Publication, UnionLocale } from './types'

export const DEMO = true

export const publications: Publication[] = [
  {
    // Appel réel, repris de l'agenda militant Demosphere Aveyron (aveyron.demosphere.net/rv/1953).
    id: 'mobilisation-5-novembre',
    titre: 'Faisons converger toutes les colères !',
    date: '2026-11-05',
    dateEvenement: '2026-11-05T14:30:00',
    lieu: 'Rodez, jardin public',
    texte:
      'Jeudi 5 novembre, à l’appel des organisations syndicales, grande journée nationale de grève et de manifestations partout en France. Salaires, services publics, coût de la vie : faisons converger toutes les colères !\n\nEn Aveyron, rendez-vous à 14 h 30 au jardin public de Rodez. Un bus CGT part de Villefranche-de-Rouergue, Decazeville et Millau.',
    theme: 'Mobilisation',
    epingle: true,
    visuels: [{ legende: 'Toutes et tous dans la rue', teinte: 'rouge' }],
    source: 'site',
  },
  {
    id: 'exemple-permanence',
    titre: 'Une question sur votre contrat ? La permanence juridique vous reçoit',
    date: '2026-11-03',
    texte:
      'Exemple de publication avec photo. Chaque semaine, des militantes et militants formés reçoivent les salariés, syndiqués ou non, pour répondre à leurs questions : contrat, salaire, licenciement, rupture conventionnelle. Venez avec vos documents.',
    theme: 'Droits',
    unionLocale: 'UL Villefranche-de-Rouergue',
    visuels: [{ legende: 'Permanence juridique', teinte: 'encre' }],
    source: 'site',
  },
  {
    id: 'exemple-court',
    titre: 'Merci à toutes celles et ceux venus à l’assemblée générale',
    date: '2026-10-30',
    texte:
      'Exemple de publication courte, sans photo : elle s’affiche en grand, comme une citation, pour rester lisible dans le fil.',
    theme: 'Vie syndicale',
    source: 'import-facebook',
  },
  {
    id: 'exemple-formation',
    titre: 'Nouveaux élus CSE : la formation vous attend',
    date: '2026-10-28',
    texte:
      'Exemple de publication avec plusieurs photos : faites glisser la galerie du doigt, ou touchez une image pour l’ouvrir en plein écran. Inscriptions auprès de votre union locale.',
    theme: 'Formation',
    visuels: [
      { legende: 'Formation CSE', teinte: 'papier' },
      { legende: 'Module 1', teinte: 'rouge' },
      { legende: 'Module 2', teinte: 'encre' },
    ],
    source: 'site',
  },
  {
    id: 'exemple-elections',
    titre: 'Élections professionnelles : la liste CGT est déposée',
    date: '2026-10-22',
    texte:
      'Exemple de publication liée à une entreprise. Le texte peut être long : il est coupé dans le fil et s’affiche en entier sur la page de la publication, avec une adresse que l’on peut partager sur Facebook ou WhatsApp.',
    theme: 'Élections',
    visuels: [{ legende: 'Votez CGT', teinte: 'rouge' }],
    source: 'import-facebook',
  },
  {
    id: 'exemple-rassemblement',
    titre: 'Retour en images sur le rassemblement',
    date: '2026-10-18',
    texte: 'Exemple de publication importée depuis Facebook au lancement du site.',
    theme: 'Mobilisation',
    visuels: [
      { legende: 'Le cortège', teinte: 'encre' },
      { legende: 'Prises de parole', teinte: 'rouge' },
    ],
    source: 'import-facebook',
  },
]

// Rendez-vous réels uniquement : pas de date inventée.
export const evenements: Evenement[] = [
  { id: 'mobilisation-5-novembre', titre: 'Journée nationale de grève et de manifestations', date: '2026-11-05', heure: '14 h 30', lieu: 'Rodez, jardin public', type: 'Manifestation' },
]

// Coordonnées à compléter : rien n'est inventé ici.
export const unionsLocales: UnionLocale[] = [
  { id: 'ud', nom: 'Union départementale CGT de l’Aveyron' },
  { id: 'villefranche', nom: 'Union locale de Villefranche-de-Rouergue' },
]
