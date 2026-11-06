// Connexion à Firebase (Firestore, Storage, Authentication).
// Chargé à la demande : le reste du site fonctionne sans.
import { initializeApp, type FirebaseApp, type FirebaseOptions } from 'firebase/app'
import { connectFirestoreEmulator, initializeFirestore, type Firestore } from 'firebase/firestore'
import { getStorage, type FirebaseStorage } from 'firebase/storage'
import { connectAuthEmulator, getAuth, type Auth } from 'firebase/auth'
import { FIREBASE } from '../config'

export type Services = { app: FirebaseApp; db: Firestore; storage: FirebaseStorage; auth: Auth }

let promesse: Promise<Services | null> | null = null

/** Réglages du projet : ceux de config.ts s'ils sont remplis, sinon ceux que fournit Firebase Hosting. */
// Tests en local seulement : `VITE_EMULATEURS=1 npm run dev` branche le site sur les émulateurs Firebase
// (Firestore 8085, Authentication 9099). Jamais actif dans la version en ligne (variable absente au build).
const EMULATEURS = import.meta.env.VITE_EMULATEURS === '1'

async function lireReglages(): Promise<FirebaseOptions | null> {
  if (EMULATEURS) return { apiKey: 'demo', projectId: 'demo-cgt', appId: 'demo', authDomain: 'localhost' }
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
    const storage = getStorage(app)
    // Par défaut, Firebase réessaie un envoi pendant 10 minutes sans rien dire : on abandonne au bout d'une minute.
    storage.maxUploadRetryTime = 60_000
    storage.maxOperationRetryTime = 30_000
    const db = initializeFirestore(app, { ignoreUndefinedProperties: true })
    const auth = getAuth(app)
    if (EMULATEURS) {
      connectFirestoreEmulator(db, '127.0.0.1', 8085)
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true })
    }
    return { app, db, storage, auth }
  })
  return promesse
}
