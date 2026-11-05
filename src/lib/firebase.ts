// Connexion à Firebase (Firestore, Storage, Authentication).
// Chargé à la demande : le reste du site fonctionne sans.
import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { initializeFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { getAuth, type Auth } from 'firebase/auth'
import { FIREBASE } from '../config'

export type Services = { app: FirebaseApp; db: Firestore; storage: FirebaseStorage; auth: Auth }

let promesse: Promise<Services | null> | null = null

/** Réglages du projet : ceux de config.ts s'ils sont remplis, sinon ceux que fournit Firebase Hosting. */
async function lireReglages(): Promise<FirebaseOptions | null> {
  if (FIREBASE.apiKey && FIREBASE.appId) return FIREBASE
  try {
    const r = await fetch('/__/firebase/init.json')
    if (!r.ok) return null
    const json = (await r.json()) as FirebaseOptions
    return json.apiKey ? json : null
  } catch {
    return null
  }
}

/** Renvoie les services Firebase, ou null si le projet n'est pas encore configuré. */
export function services(): Promise<Services | null> {
  promesse ??= lireReglages().then((reglages) => {
    if (!reglages) return null
    const app = initializeApp(reglages)
    return {
      app,
      db: initializeFirestore(app, { ignoreUndefinedProperties: true }),
      storage: getStorage(app),
      auth: getAuth(app),
    }
  })
  return promesse
}
