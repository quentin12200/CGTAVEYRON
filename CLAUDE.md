# Site de l'UD CGT Aveyron

Site public de l'Union départementale CGT de l'Aveyron. Page d'accueil = fil de publications façon Facebook ; on publie d'abord ici, puis on partage le lien sur Facebook.

Cahier des charges complet (objectifs, feuille de route, prompts par étape) : document « Site internet CGT Aveyron — cahier des charges » de Quentin.

## Pile technique

- React 19 + Vite + TypeScript, Tailwind CSS v4 (`@tailwindcss/vite`), animations avec `motion` (`motion/react`), routes avec `react-router-dom`.
- Hébergement : Firebase Hosting, projet `cgtaveyron` (`.firebaserc`), adresse du site https://cgtaveyron.web.app. Firestore, Storage, Authentication et Functions arrivent aux étapes suivantes.
- Code sur GitHub (`quentin12200/CGTAVEYRON`), branche de production **`principal`**.
- Déploiement : `.github/workflows/deploy.yml` (push sur `principal` → production ; et toutes les heures si le flux RSS a changé) et `preview.yml` (pull request → version de test 7 jours). Secret requis : `FIREBASE_SERVICE_ACCOUNT_CGTAVEYRON`.

## Commandes

- `npm run dev` — serveur local
- `npm run build` — vérification TypeScript + build dans `dist/` + flux RSS (`scripts/rss.mjs`)
- Mise en ligne sans rien installer : GitHub → onglet Actions → « Mise en ligne » → Run workflow (ou fusionner une pull request dans `principal`).

## Organisation

- `src/config.ts` — réglages à compléter (lien d'adhésion, Facebook, e-mail de l'UD).
- `src/data/types.ts` — modèle de données (Publication, Evenement, UnionLocale). Reprendre ces champs pour Firestore.
- `src/data/enDirect.ts` — `listeEnDirect()` : une liste de base + une collection Firestore écoutée en direct (un document Firestore remplace l'élément de même `id` ; `masque: true` le retire du site).
- `src/data/publications.ts` (`facebook.ts` + Firestore `publications`), `evenements.ts` (`demo.ts` + `evenements`), `unions.ts` (`demo.ts` + `unionsLocales`) — hooks `useXxx()` (visibles) et `useTousXxx()` (administration).
- `src/data/reglages.ts` — liens et textes des pages (`REGLAGES_DEFAUT`, `RUBRIQUES` pour l'admin), document Firestore `reglages/site` (seuls les textes modifiés y sont enregistrés). Hook `useReglages()` ; les pages l'utilisent au lieu de `SITE`. Tout nouveau texte fixe d'une page doit y être ajouté pour rester modifiable.
- `src/lib/firebase.ts` — connexion Firebase chargée à la demande ; réglages lus dans `/__/firebase/init.json` (Firebase Hosting) ou `FIREBASE` dans `config.ts`. Sans Firebase, le site affiche les publications importées. `VITE_EMULATEURS=1 npm run dev` branche le site sur les émulateurs locaux (Firestore 8085, Auth 9099) pour tester ; absent de la version en ligne.
- `src/data/soutiens.ts` — bouton « ✊ Je soutiens » partagé : `soutiens/{publication}` `{ total }` (lecture publique) et `soutiens/{publication}/par/{uid}` (un soutien par identité). Identité anonyme Firebase créée au premier clic (fournisseur **Anonyme** à activer dans Authentication). Écriture en lot (soutien + `increment(±1)`), clic optimiste, retour arrière si refus. Les règles n'acceptent que ±1 lié au soutien de la personne ; testées dans l'émulateur (17 cas). Une identité anonyme n'ouvre jamais `/admin`.
- `src/pages/Admin.tsx` — `/admin` (non référencé), connexion Google, quatre onglets : **Publications** (texte, photos réduites à 1600 px sans métadonnées dans Storage `publications/{id}/`, mise à la une, retrait), **Agenda**, **Contacts** (unions locales), **Site** (liens et textes). L'admin doit pouvoir tout modifier. Toujours en mode clair (classe `clair` sur `<html>`), même si le téléphone est en mode sombre. Le site refuse l'assombrissement forcé des navigateurs (`color-scheme: only light`, `<meta name="darkreader-lock">`) et pose son fond sur un conteneur `isolate` (`#fond`) dans `App.tsx`. `ProtegerLeFond` (App.tsx) remet en style en ligne `!important` le fond, une image unie `linear-gradient(var(--bg), var(--bg))` et la couleur du texte sur `html`, `body`, `#root`, `#fond`, `header`, `main`, `main > div|section|form` et `aside`, à chaque page et à chaque ajout de blocs dans `#fond` (MutationObserver, une fois par image : indispensable pour `/admin`, chargée en différé). Chaque bloc garde sa couleur : `bg-surface` → `--surface`, autre `bg-*` (rouge, jaune…) laissé tel quel, sinon `--bg`. Raison : une extension Chrome de l'administrateur impose `background-color: #111` avec une priorité « utilisateur » (`insertCSS` origin USER), qu'aucun style du site ne bat ; elle ne touche pas `background-image`, d'où l'image unie. Reproduit et vérifié avec une extension de test (Playwright `channel: 'chromium'`). Conséquence : toute pastille en `-z-10` dans ces blocs doit avoir un parent `isolate`.
- `firestore.rules`, `storage.rules` — droits : lecture publique, écriture réservée aux adresses listées dans `estAdmin()`. À coller dans la console (le déploiement GitHub ne publie que Hosting).
- `src/data/demo.ts` — agenda de départ et coordonnées des unions locales fournies par l'UD (Villefranche, Onet-le-Château/Rodez, Capdenac, Decazeville, Millau, Saint-Affrique), complétés depuis `/admin`. Page Contact : tri par ville, plusieurs téléphones séparés par « / », lien « Voir sur la carte » (OpenStreetMap). Ne jamais y mettre de dates, d'adresses ou de chiffres inventés.
- `src/data/facebook.ts` — vraies publications de la page Facebook de l'UD, générées depuis l'export CSV de Meta Business Suite (8 octobre → 5 novembre 2026). Heures de l'export en heure de Californie, converties en heure de Paris. Rappels répétés dédoublonnés, publications sans texte écartées. Les photos restent sur Facebook (lien « Voir sur Facebook »).
- `public/photos/` — photos des publications (redimensionnées, métadonnées et position GPS retirées), reliées via `visuels` dans `facebook.ts`.
- `public/logo-cgt-aveyron.png` — logo officiel de l’UD (rogné depuis `AVEYRON (4).png`), aussi utilisé en favicon.
- `src/components/` — Header (réduit au scroll, tiroir mobile), Banderole (publication épinglée + compte à rebours), CartePublication, Galerie (photos **jamais recadrées** : cadre à la forme des photos entre 16:9 et 4:5, fond flou autour ; `PhotosEnPile` sur la page de publication ; plein écran), Actions (réaction ✊, partage), Visuel (photo ou visuel « tract » de secours).
- `src/lib/liens.ts` + `components/TexteAvecLiens.tsx` + `components/VideoYoutube.tsx` — les adresses écrites dans le texte d'une publication deviennent des liens ; un lien YouTube (watch, youtu.be, shorts, live) affiche la vignette de la vidéo (dans le fil si la publication n'a pas de photo, toujours sur sa page). Seule l'image `i.ytimg.com` est chargée ; la vidéo se lance au toucher via `youtube-nocookie.com` (pas de traceur avant le geste du visiteur).
- `scripts/rss.mjs` — flux RSS `dist/rss.xml` (50 dernières publications : `facebook.ts` + Firestore `publications` lu par l'API REST publique, mêmes règles que le site : remplacement par `id`, `masque` exclu). Lancé par `npm run build`. Image : première photo, sinon vignette YouTube. Date du flux = publication la plus récente, pour que le fichier ne change que si le fil change. `deploy.yml` le refait toutes les heures (cron) et ne republie que si le flux diffère de celui en ligne. Balise `<link rel="alternate">` dans `index.html`, lien « Flux RSS » dans le pied de page.
- `scripts/donnees.mjs` — données pour les fichiers du build (dépôt + Firestore REST, mêmes règles que le site). `scripts/pages.mjs` fabrique `dist/publication/{id}.html` (une page par publication avec titre, texte et image en Open Graph : aperçu correct quand le lien est partagé sur Facebook/WhatsApp ; servie par `cleanUrls`, le site s'y charge normalement), `sitemap.xml`, `robots.txt` (`/admin` exclu) et `agenda.ics`. Refaits à chaque mise en ligne et par la tâche horaire.
- `src/lib/ics.ts` — agenda au format iCalendar (heure de Paris → UTC, journée entière si pas d'heure) : bouton « Ajouter à mon agenda » sur chaque rendez-vous à venir et abonnement `webcal://cgtaveyron.web.app/agenda.ics`.
- `public/manifest.webmanifest` + `public/icones/` — site installable sur l'écran d'accueil (raccourcis Agenda, Adhérer, Contact). Pas de service worker (pas de cache à gérer).
- `src/pages/MentionsLegales.tsx` — mentions LCEN et RGPD en rubriques, textes dans `reglages.ts` (`mentions*`). Adresse du siège, téléphone et directeur de la publication sont obligatoires mais inconnus : champs vides non affichés, signalés dans `/admin → Site`. `{email}` est remplacé par l'e-mail public.
- `src/pages/` — Accueil, PublicationPage, Agenda (« À venir » + « Ils ont eu lieu », lien Facebook par rendez-vous), Adherer, Contact, MentionsLegales, Introuvable.

## Design

- Couleurs (dans `src/index.css`, `@theme`), une fonction chacune : **rouge** `#D20012` (logo) = action et banderole (fonds, boutons) ; `rouge-texte` pour les liens rouges (`#D20012` en clair, `#FF5A5F` en sombre) ; **jaune** `#FFD400` (bandeau du logo) = le temps (dates, prochain rendez-vous, étiquette « À la une »), toujours en fond avec texte encre ; **encre** `#1F1A24` ; **blanc tract** `#FFFFFF` (publications) sur **gris affiche** `#ECEBE8` (fond de page) ; ciment `#5F5A63` (texte secondaire, 5,6:1 sur le gris). Mode sombre via les variables CSS (`--bg`, `--surface`, `--text`, `--muted`, `--rule`).
- Formes : contenus à angles droits comme un tract (publications, photos, encadrés), séparés par un **filet épais** `border-t-4` couleur du texte ; seuls les boutons et filtres sont arrondis. Pas de cartes arrondies.
- « Feuilles » : tout contenu lisible est posé sur une feuille blanche (`bg-surface`) à filet épais : publications du fil, page d'une publication (titre et texte d'abord, photos ensuite, puis les actions), raisons d'Adhérer (une seule feuille découpée par des filets, pas de blocs répétés), liste des unions locales et formulaire de Contact. Pied de page : bandeau encre sous un filet rouge `border-t-8` (logo, nom, e-mail, bouton Adhérer, liens), exclu de `ProtegerLeFond`.
- Typo : Archivo étroit très gras (`font-condensed`) pour les titres, façon banderole ; le titre de la banderole est **en capitales** (seul endroit du site). Atkinson Hyperlegible Next pour le texte, 18 px (lisibilité pour tous les publics).
- Accueil : banderole rouge, puis bandeau jaune « Prochain rendez-vous » (téléphone ; sur ordinateur, la colonne de droite le montre), puis le fil. Bouton Adhérer toujours visible dans l'en-tête, même sur téléphone. Agenda : dates en pavé jaune façon autocollant (gris si passé).
- Banderole « À la une » : publication épinglée depuis `/admin`, **à défaut la plus récente** (jamais vide). Elle attend la première réponse de Firestore (`usePublicationsPretes`, 2,5 s au plus ; bloc rouge vide en attendant) pour ne pas se déployer sur une publication que Firestore désépingle ensuite. Elle affiche la première photo de la publication épinglée, entière, comme un tirage épinglé (légère inclinaison, cadre blanc), lien vers la page de la publication.
- Mouvement : un seul grand mouvement automatique, la banderole, joué **une fois par visite** (pas à chaque retour sur l'accueil) : elle se déroule de gauche à droite (`clipPath` sur toute la section, 0,7 s), puis le titre monte mot par mot, puis la photo tombe et se pose (ressort). Le bloc d'attente n'est pas rouge, pour que le déroulé se voie. Seule animation continue du site, voulue par l'UD : le pli et le reflet de la banderole glissent lentement (classe `.vent`, CSS, 7 s aller-retour), arrêtés si « réduire les animations ». Pas d'apparition des cartes au défilement, pas de pastille qui pulse. Le reste répond aux gestes (menu, galerie, réaction, filtres). `MotionConfig reducedMotion="user"` + règle CSS respectent le réglage « réduire les animations » (on retire les déplacements, on garde les fondus de couleur).
- Skills du projet (`.claude/skills/`) : **`frontend-design`** (Anthropic, Apache 2.0, `LICENSE.txt`) pour toute décision visuelle (plan de design avant le code, éviter les choix par défaut), et pour le mouvement les skills `emil-design-eng` et `review-animations` (Emil Kowalski, licence MIT). Bibliothèque d'animation : **Motion** (`motion/react`, motion.dev), seule bibliothèque d'animation du site.
- Règles d'animation : suivre les skills `.claude/skills/emil-design-eng` et `review-animations` (Emil Kowalski, licence MIT). Courbes communes dans `src/lib/mouvement.ts` et en jetons CSS `--ease-sortie`, `--ease-deplacement`, `--ease-tiroir` (classes `ease-sortie`…) : ne pas en inventer d'autres. Interface sous 300 ms, sortie plus rapide que l'entrée, jamais d'animation sur une action au clavier (Échap, flèches), jamais `transition-all`, n'animer que `transform`/`scale`/`opacity` quand c'est possible (pas `height` sur l'en-tête : hauteur fixe, seul le logo rétrécit).
- Filtres du fil : au toucher, la liste réapparaît en 180 ms (`useAnimate`, fondu + glissement de 6 px, `EASE_SORTIE`) ; rien au premier affichage ni au clavier (`event.detail === 0`).
- Tout bouton ou lien en forme de bouton porte la classe `appui` (enfoncement à 97 % au toucher, 160 ms) à la place de `transition-colors`.
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
- [ ] Étape 5 — ~~réactions partagées~~ (fait : `soutiens.ts`), ~~aperçus Open Graph~~ (fait : `scripts/pages.mjs`), ~~PWA~~ (manifeste, sans hors-ligne), formulaire de contact. Les messages du formulaire doivent arriver à leyrat.quentin@gmail.com (destinataire à mettre côté serveur, Functions ou extension Trigger Email, jamais dans le code du site). Adresse publique affichée : ud@cgt12.fr (`SITE.email`). En attendant, le formulaire ouvre un e-mail prérempli vers ud@cgt12.fr.
- [ ] Étape 6 — import des posts Facebook du dernier mois (textes importés dans `facebook.ts` ; reste : photos, puis passage dans Firestore)
