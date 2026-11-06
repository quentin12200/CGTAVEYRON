# Site de l'UD CGT Aveyron

Site public de l'Union départementale CGT de l'Aveyron. Page d'accueil = fil de publications façon Facebook ; on publie d'abord ici, puis on partage le lien sur Facebook.

Cahier des charges complet (objectifs, feuille de route, prompts par étape) : document « Site internet CGT Aveyron — cahier des charges » de Quentin.

## Pile technique

- React 19 + Vite + TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), animations avec `motion` (`motion/react`), routes avec `react-router-dom`.
- Hébergement : Firebase Hosting, projet `cgtaveyron` (`.firebaserc`), adresse du site https://cgtaveyron.web.app. Firestore, Storage, Authentication et Functions arrivent aux étapes suivantes.
- Code sur GitHub (`quentin12200/CGTAVEYRON`), branche de production **`principal`**.
- Déploiement : `.github/workflows/deploy.yml` (push sur `principal` → production) et `preview.yml` (pull request → version de test 7 jours). Secret requis : `FIREBASE_SERVICE_ACCOUNT_CGTAVEYRON`.

## Commandes

- `npm run dev` — serveur local
- `npm run build` — vérification TypeScript + build dans `dist/`
- Mise en ligne sans rien installer : GitHub → onglet Actions → « Mise en ligne » → Run workflow (ou fusionner une pull request dans `principal`).

## Organisation

- `src/config.ts` — réglages à compléter (lien d'adhésion, Facebook, e-mail de l'UD).
- `src/data/types.ts` — modèle de données (Publication, Evenement, UnionLocale). Reprendre ces champs pour Firestore.
- `src/data/enDirect.ts` — `listeEnDirect()` : une liste de base + une collection Firestore écoutée en direct (un document Firestore remplace l'élément de même `id` ; `masque: true` le retire du site).
- `src/data/publications.ts` (`facebook.ts` + Firestore `publications`), `evenements.ts` (`demo.ts` + `evenements`), `unions.ts` (`demo.ts` + `unionsLocales`) — hooks `useXxx()` (visibles) et `useTousXxx()` (administration).
- `src/data/reglages.ts` — liens et textes des pages (`REGLAGES_DEFAUT`, `RUBRIQUES` pour l'admin), document Firestore `reglages/site` (seuls les textes modifiés y sont enregistrés). Hook `useReglages()` ; les pages l'utilisent au lieu de `SITE`. Tout nouveau texte fixe d'une page doit y être ajouté pour rester modifiable.
- `src/lib/firebase.ts` — connexion Firebase chargée à la demande ; réglages lus dans `/__/firebase/init.json` (Firebase Hosting) ou `FIREBASE` dans `config.ts`. Sans Firebase, le site affiche les publications importées.
- `src/pages/Admin.tsx` — `/admin` (non référencé), connexion Google, quatre onglets : **Publications** (texte, photos réduites à 1600 px sans métadonnées dans Storage `publications/{id}/`, mise à la une, retrait), **Agenda**, **Contacts** (unions locales), **Site** (liens et textes). L'admin doit pouvoir tout modifier. Toujours en mode clair (classe `clair` sur `<html>`), même si le téléphone est en mode sombre. Le site refuse l'assombrissement forcé des navigateurs (`color-scheme: only light`, `<meta name="darkreader-lock">`) et pose son fond sur un conteneur `isolate` dans `App.tsx`, pas seulement sur `<body>` : une extension qui repeint le fond de la page en noir ne rend plus le texte illisible.
- `firestore.rules`, `storage.rules` — droits : lecture publique, écriture réservée aux adresses listées dans `estAdmin()`. À coller dans la console (le déploiement GitHub ne publie que Hosting).
- `src/data/demo.ts` — agenda et unions locales de départ (complétés depuis `/admin`). Ne jamais y mettre de dates, d'adresses ou de chiffres inventés.
- `src/data/facebook.ts` — vraies publications de la page Facebook de l'UD, générées depuis l'export CSV de Meta Business Suite (8 octobre → 5 novembre 2026). Heures de l'export en heure de Californie, converties en heure de Paris. Rappels répétés dédoublonnés, publications sans texte écartées. Les photos restent sur Facebook (lien « Voir sur Facebook »).
- `public/photos/` — photos des publications (redimensionnées, métadonnées et position GPS retirées), reliées via `visuels` dans `facebook.ts`.
- `public/logo-cgt-aveyron.png` — logo officiel de l’UD (rogné depuis `AVEYRON (4).png`), aussi utilisé en favicon.
- `src/components/` — Header (réduit au scroll, tiroir mobile), Banderole (publication épinglée + compte à rebours), CartePublication, Galerie (photos **jamais recadrées** : cadre à la forme des photos entre 16:9 et 4:5, fond flou autour ; `PhotosEnPile` sur la page de publication ; plein écran), Actions (réaction ✊, partage), Visuel (photo ou visuel « tract » de secours).
- `src/pages/` — Accueil, PublicationPage, Agenda (« À venir » + « Ils ont eu lieu », lien Facebook par rendez-vous), Adherer, Contact, MentionsLegales, Introuvable.

## Design

- Couleurs (dans `src/index.css`, `@theme`) : rouge `#D20012` (celui du logo) pour les fonds et boutons, `rouge-texte` pour les liens et textes rouges (`#D20012` en clair, `#FF5A5F` en sombre : le rouge du logo n'atteint pas 4,5:1 sur fond sombre), rouge foncé `#A8000E`, encre `#1F1A24`, papier `#F7F7F5`, ciment `#6F6B73`, ligne `#E4E2E6` ; mode sombre automatique via des variables CSS (`--bg`, `--surface`, `--text`, `--muted`, `--rule`).
- Typo : Archivo étroit très gras (`font-condensed`) pour les titres, façon banderole ; Atkinson Hyperlegible Next pour le texte (lisibilité pour tous les publics).
- Banderole « À la une » : affiche la première photo de la publication épinglée, entière, comme un tirage épinglé (légère inclinaison, cadre blanc), lien vers la page de la publication.
- Mouvement : un seul grand mouvement automatique (la banderole qui se déploie au chargement, photo comprise). Pas d'apparition des cartes au défilement, pas de pastille qui pulse. Le reste répond aux gestes (menu, galerie, réaction, filtres). `MotionConfig reducedMotion="user"` + règle CSS respectent le réglage « réduire les animations ».
- Mobile d'abord : les visiteurs arrivent surtout depuis Facebook sur téléphone.
- Accessibilité (WCAG 2.2 AA) : contrastes vérifiés en clair et en sombre, visionneuse plein écran au clavier (focus placé, piégé, rendu), noms accessibles sur les champs et boutons-icônes. Ne rien afficher « à compléter » au public.
- Textes de l'interface en français, voix active, phrases courtes, pas de majuscules partout.

## Conventions

- Noms de composants et de variables en français, cohérents avec l'existant.
- Pas de cookies publicitaires ni de traceurs.
- Les comptes (Google/Firebase, GitHub, domaine) doivent à terme appartenir à l'UD.
- Mettre à jour ce fichier à la fin de chaque étape.

## Avancement

- [x] Étape 1 — socle, design, routes, déploiement (contenu de démo)
- [x] Étape 2 — fil sur Firestore (publications ; agenda et unions locales encore dans `demo.ts`)
- [x] Étape 3 — pages Contact / Agenda / Adhérer sur Firestore (agenda, unions locales, liens et textes modifiables depuis `/admin`)
- [x] Étape 4 — mode administrateur `/admin` (publications, photos, agenda, contacts, liens et textes)
- [ ] Étape 5 — réactions partagées, formulaire de contact, aperçus Open Graph, PWA. Les messages du formulaire doivent arriver à leyrat.quentin@gmail.com (destinataire à mettre côté serveur, Functions ou extension Trigger Email, jamais dans le code du site). Adresse publique affichée : ud@cgt12.fr (`SITE.email`). En attendant, le formulaire ouvre un e-mail prérempli vers ud@cgt12.fr.
- [ ] Étape 6 — import des posts Facebook du dernier mois (textes importés dans `facebook.ts` ; reste : photos, puis passage dans Firestore)
