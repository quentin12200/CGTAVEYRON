// CONTENU DE DÉMONSTRATION — à remplacer par Firestore (étape 2 de la feuille de route).
// Les textes, dates et lieux ci-dessous sont des exemples, pas des informations réelles.
import type { Evenement, Publication, UnionLocale } from './types'

export const DEMO = true

export const publications: Publication[] = [
  {
    id: 'exemple-mobilisation',
    titre: 'Journée de mobilisation interprofessionnelle',
    date: '2026-11-04',
    dateEvenement: '2026-11-26T10:30:00',
    lieu: 'Rodez, place d’Armes (exemple)',
    texte:
      'Exemple de publication épinglée. Ici, l’appel à la mobilisation : les revendications, le lieu du rassemblement, l’heure de départ des cars depuis chaque union locale. Le compte à rebours se règle tout seul sur la date de l’événement.',
    theme: 'Mobilisation',
    epingle: true,
    visuels: [{ legende: 'Tous dans la rue', teinte: 'rouge' }],
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
    titre: 'Merci aux 120 participants de l’assemblée générale',
    date: '2026-10-30',
    texte:
      'Exemple de publication courte, sans photo : elle s’affiche en grand, comme une citation, pour rester lisible dans le fil.',
    theme: 'Vie syndicale',
    source: 'import-facebook',
  },
  {
    id: 'exemple-formation',
    titre: 'Nouveaux élus CSE : la formation reprend en janvier',
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
    titre: 'Retour en images sur le rassemblement de samedi',
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

export const evenements: Evenement[] = [
  { id: 'e1', titre: 'Journée de mobilisation interprofessionnelle', date: '2026-11-26', heure: '10 h 30', lieu: 'Rodez (exemple)', type: 'Manifestation' },
  { id: 'e2', titre: 'Commission exécutive de l’UD', date: '2026-12-03', heure: '8 h', lieu: 'Siège de l’UD (exemple)', type: 'Assemblée' },
  { id: 'e3', titre: 'Permanence juridique', date: '2026-12-08', heure: '14 h', lieu: 'UL Villefranche-de-Rouergue (exemple)', type: 'Permanence' },
  { id: 'e4', titre: 'Formation « Je découvre la CGT »', date: '2027-01-14', heure: '9 h', lieu: 'À préciser', type: 'Formation' },
]

// Coordonnées à compléter : rien n'est inventé ici.
export const unionsLocales: UnionLocale[] = [
  { id: 'ud', nom: 'Union départementale CGT de l’Aveyron' },
  { id: 'villefranche', nom: 'Union locale de Villefranche-de-Rouergue' },
]
