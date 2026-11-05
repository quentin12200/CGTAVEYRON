// Réglages du site à compléter par l'UD.
export const SITE = {
  nom: 'CGT Aveyron',
  nomLong: 'Union départementale CGT de l’Aveyron',
  // Formulaire d'adhésion en ligne de la CGT.
  adhesionUrl: 'https://www.cgt.fr/syndicalisation/syndiquez-vous#forward',
  // Inscription aux bus CGT pour les manifestations.
  busUrl: 'https://inscriptioncgtbusaveyron.vercel.app/index.html',
  facebookUrl: 'https://www.facebook.com/udcgt.aveyron',
  // Adresse publique de contact, affichée sur le site.
  email: 'ud@cgt12.fr',
}

// Réglages Firebase. Laisser vide : sur Firebase Hosting, le site les lit tout seul
// à l'adresse /__/firebase/init.json (il faut avoir ajouté une « application Web » au projet).
// À remplir seulement pour tester l'administration avec `npm run dev`.
export const FIREBASE = {
  apiKey: '',
  authDomain: 'cgtaveyron.firebaseapp.com',
  projectId: 'cgtaveyron',
  storageBucket: 'cgtaveyron.firebasestorage.app',
  messagingSenderId: '',
  appId: '',
}
