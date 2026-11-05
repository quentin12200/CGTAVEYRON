# Site internet CGT Aveyron — cahier des charges

Nov 5, 2026 · @Quentin Leyrat

## Objectifs

L'UD se dote d'un site à elle, alimenté au même rythme que Facebook, pour ne plus dépendre d'une plateforme dont nous ne maîtrisons ni les règles ni la portée.

**Le constat.** L'ancien site est resté vide parce qu'il demandait un travail en plus de Facebook. Le nouveau doit coûter moins d'effort qu'un post Facebook, sinon il mourra de la même façon.

**Le principe : publier une fois, diffuser partout.** On publie d'abord sur le site, puis on partage le lien sur Facebook. Le site garde tout l'historique, et Facebook devient un relais vers chez nous.

**Ce que le site doit permettre :**

- informer en continu, avec un fil d'actualités qui se lit comme Facebook ;
- donner en un clic les coordonnées et permanences de l'UD et des unions locales, et permettre de nous écrire ;
- faciliter l'adhésion ;
- offrir un rendu visuel moderne et animé, à la hauteur des sites qu'on consulte tous les jours ;
- permettre aux rédacteurs de publier depuis un mode administrateur, sans toucher au code ;
- démarrer avec un fil déjà rempli grâce aux posts Facebook du dernier mois ;
- rester accessible même si un réseau social restreint notre page.

## Arborescence du site

Cinq pages publiques et un mode administrateur : le fil en accueil, une page par publication, et trois rubriques fixes dans le menu (Contact, Agenda, Adhérer). La page « Tes droits » est mise de côté pour une version ultérieure.

&#91;embedded content: arborescence du site · 7 pages\]

Seuls le fil et l'agenda changent souvent ; la page Contact réunit les coordonnées de l'UD et des unions locales, la carte et le formulaire.

## Le fil d'actualités

La page d'accueil est un fil de cartes, le plus récent en haut, qui se charge au fur et à mesure du défilement comme sur Facebook.

**Fonctionnement :**

- 10 publications chargées au départ, les suivantes s'ajoutent en bas en scrollant ;
- filtres par thème en haut du fil (une pastille par thème) ;
- une publication épinglée possible en tête (grève, manif, appel urgent) ;
- chaque carte s'ouvre sur sa propre page, avec une adresse partageable ;
- un flux RSS automatique pour ceux qui veulent suivre sans réseau social.

**Champs d'une publication (ce qu'on remplit dans l'interface) :**

| Champ | Obligatoire | Exemple |
| --- | --- | --- |
| Titre | oui | Grève à l'usine X jeudi |
| Date | oui (pré-remplie) | 5 novembre 2026 |
| Texte | oui | Le texte du post, comme sur Facebook |
| Photos | non | 1 à 10 images, la première sert de vignette |
| Vidéo | non | Lien YouTube/PeerTube ou fichier |
| Thème | oui | Mobilisation, Droits, Vie syndicale, Formation, Élections |
| Union locale / syndicat | non | UL Villefranche-de-Rouergue |
| Document joint | non | Tract PDF |
| Épingler | non | case à cocher |
| Lien Facebook | non | pour renvoyer vers le post d'origine |

Le titre et le texte suffisent pour publier : tout le reste est optionnel, pour garder la publication aussi rapide qu'un post.

## Design et animations

Le site doit donner envie de scroller : un rendu moderne, fluide et animé, qui reste rapide sur un téléphone d'entrée de gamme.

- **Identité** : rouge CGT franc en couleur d'accent, beaucoup de blanc (ou noir en mode sombre), typographie grasse et moderne pour les titres (ex. Inter, Space Grotesk ou Archivo), coins arrondis, ombres légères.
- **Fil** : cartes avec grande photo, apparition en fondu et léger glissement au scroll, survol qui soulève la carte, chargement avec squelettes animés plutôt qu'un sablier.
- **Galeries photo** : carrousel glissable au doigt, ouverture plein écran avec transition fluide.
- **Navigation** : en-tête qui se réduit au scroll, menu mobile en tiroir animé, transitions douces entre les pages.
- **Moments forts** : bannière animée pour la publication épinglée (grève, manif), compteur à rebours vers la prochaine mobilisation.
- **Mode sombre** automatique selon le téléphone.
- **Garde-fous** : animations désactivées si le téléphone demande moins de mouvement (réglage d'accessibilité), images compressées automatiquement, objectif de chargement sous 2 secondes en 4G.

## Mode administrateur

Une page `/admin` protégée par mot de passe, pensée comme la zone « Créer une publication » de Facebook.

- **Connexion** : Firebase Authentication (e-mail + mot de passe ou compte Google), seuls les comptes déclarés comme rédacteurs y ont accès.
- **Composer** : une zone de texte, un bouton pour ajouter des photos (glisser-déposer ou appareil photo du téléphone), choix du thème, case « épingler », aperçu avant publication.
- **Publier** : la publication apparaît immédiatement dans le fil, sans redéploiement.
- **Gérer** : liste des publications avec modifier, dépublier, supprimer ; gestion de l'agenda et des coordonnées des UL depuis la même interface.
- **Après publication** : bouton « Copier le lien pour Facebook ».
- **Rôles** : un administrateur (gère les rédacteurs) et des rédacteurs (publient).

## Import des posts Facebook au démarrage

Pour ne pas lancer un fil vide, on importe une seule fois les posts du dernier mois. Trois options, de la plus fiable à la plus simple :

1. **Export officiel de la Page (recommandé).** Depuis les paramètres de la Page Facebook, un administrateur demande le téléchargement des informations de la Page au format JSON, sur la période voulue (à vérifier dans l'interface Meta au moment de le faire). On obtient un fichier avec les textes, dates et photos. Un script, écrit par Claude Code, lit ce fichier et crée les publications dans Firestore avec leurs photos dans Firebase Storage, en les marquant « importé de Facebook ».
2. **API Graph en une fois.** Un script récupère les posts de la Page via l'API de Meta avec un jeton d'accès temporaire d'administrateur. Plus automatique, mais demande de créer une application Meta et peut buter sur des autorisations ; à garder en plan B.
3. **Saisie manuelle.** Recopier une dizaine de posts via le mode administrateur : une heure de travail, zéro risque technique.

Dans tous les cas, l'import se fait une seule fois. Ensuite, la règle reste : on publie sur le site, puis on partage sur Facebook.

## Interactions

Pas de comptes utilisateurs : on garde une réaction anonyme et le partage, et on renonce aux commentaires.

- **Réaction anonyme ✊** : un bouton avec un compteur, sans inscription ni cookie de suivi. Une seule réaction par navigateur, mémorisée localement. Ça donne un retour sur ce qui marche sans gérer de données personnelles.
- **Partage** : boutons WhatsApp, Facebook, e-mail et « copier le lien » sur chaque publication. C'est ce qui fait réellement circuler l'info.
- **Pas de commentaires** : la modération serait une charge permanente et un risque juridique pour l'UD (propos diffamatoires, injures). Les échanges restent sur Facebook ou passent par le formulaire de contact.
- **Plus tard, si besoin** : inscription à une lettre d'info par e-mail, envoyée automatiquement avec les dernières publications.

## Choix techniques

Tout tourne sur Firebase (hébergement, données, photos, connexion admin), le code vit sur GitHub et chaque modification du code est mise en ligne automatiquement.

| Brique | Choix proposé | Rôle |
| --- | --- | --- |
| Interface du site | React + Vite + TypeScript, Tailwind CSS | Site rapide et moderne, bien maîtrisé par Claude Code |
| Animations | Framer Motion | Apparitions au scroll, transitions, galeries fluides |
| Hébergement | Firebase Hosting | Site en ligne, HTTPS et nom de domaine personnalisé |
| Publications, agenda, UL | Cloud Firestore | Base de données ; une publication apparaît dès qu'elle est enregistrée |
| Photos et tracts | Firebase Storage + extension Resize Images | Stockage des fichiers, miniatures générées automatiquement |
| Connexion admin | Firebase Authentication + règles de sécurité | Seuls les rédacteurs déclarés peuvent écrire |
| Réactions ✊ | Compteur dans Firestore + Firebase App Check | Réaction anonyme, protégée contre les robots |
| Formulaire de contact | Firestore + extension Trigger Email | Le message arrive par e-mail à l'UD |
| Aperçus Facebook/WhatsApp | Cloud Function sur les pages publication | Titre et photo affichés quand on partage le lien |
| Code source | Dépôt GitHub au nom de l'UD | Historique, sauvegarde, travail avec Claude Code |
| Mise en ligne | GitHub Actions → Firebase | Déploiement automatique à chaque modification, version de test à chaque proposition de changement |
| Nom de domaine | à choisir (ex. cgt-aveyron.fr, à vérifier) | Environ 10 à 15 € par an |

**Points importants :**

- le site doit être pensé d'abord pour le téléphone, c'est là que les gens arrivent depuis Facebook ;
- installable comme une appli (PWA) ;
- accessible (contrastes, textes alternatifs sur les images) ;
- les comptes Google/Firebase, GitHub et le domaine doivent être au nom de l'UD, pas d'une personne, pour que le site survive aux changements de mandat ;
- Storage, les Cloud Functions et les extensions demandent le forfait Firebase Blaze (paiement à l'usage, avec quota gratuit) : à ce volume le coût reste proche de zéro, mais on pose une alerte budget à quelques euros dès la création du projet.

Avant de choisir le domaine : vérifier s'il reste à l'UD l'adresse de l'ancien site, et la charte graphique confédérale à respecter.

## Organisation de la publication

La règle d'or : tout ce qui part sur Facebook part d'abord sur le site.

**La routine, en moins de 5 minutes :**

1. Ouvrir le mode administrateur (`/admin`) depuis le téléphone ou l'ordinateur.
2. Coller le texte, ajouter les photos, choisir le thème, publier.
3. La publication apparaît tout de suite dans le fil.
4. Cliquer « Copier le lien pour Facebook » et le coller dans le post Facebook.

**Qui publie :** 2 ou 3 rédacteurs désignés au départ (à valider en Bureau), avec chacun son accès. Les unions locales peuvent avoir le leur plus tard.

**Ce qu'on évite :** synchroniser Facebook en continu. L'API de Meta exige une validation d'application et des jetons qui expirent ; ça casse régulièrement et personne ne saura le réparer. On fait un import unique au démarrage, puis le site devient la source.

**Au lancement :** importer les posts Facebook du dernier mois (voir la section Import) pour que le fil soit rempli dès le premier jour.

## Feuille de route Claude Code

Six étapes après la préparation, une session Claude Code chacune ; on valide le résultat sur la version de test avant de passer à la suivante.

**Étape 0 — Préparer.** Créer un compte Google au nom de l'UD, puis le projet Firebase (forfait Blaze + alerte budget) et le dépôt GitHub. Rassembler logo, couleurs, adresses et horaires des UL, et lancer l'export des informations de la Page Facebook.

Déjà créés le 5 novembre 2026 : le [dépôt GitHub quentin12200/CGTAVEYRON](https://github.com/quentin12200/CGTAVEYRON) (vide, branche par défaut « principal ») et le [projet Firebase cgtaveyron](https://console.firebase.google.com/project/cgtaveyron/overview). À transférer à terme sur des comptes au nom de l'UD.

**Étape 1 — Socle, design et mise en ligne.**

> Crée un projet React + Vite + TypeScript avec Tailwind CSS et Framer Motion pour le site de l'Union départementale CGT de l'Aveyron, hébergé sur Firebase Hosting. Style hyper moderne : rouge CGT en accent, typographie grasse, cartes arrondies, animations d'apparition au scroll, en-tête qui se réduit, menu mobile en tiroir animé, mode sombre automatique, respect du réglage « réduire les animations ». Mobile d'abord, accessible. Menu : Accueil, Agenda, Adhérer, Contact. Configure le déploiement automatique depuis GitHub avec GitHub Actions (production sur la branche main, version de test sur chaque pull request). Crée un fichier CLAUDE.md qui décrit le projet et ses conventions.

**Étape 2 — Le fil d'actualités.**

> Crée une collection Firestore « publications » avec : titre, date, texte, images (liste d'URL Storage), vidéo (lien), thème (Mobilisation, Droits, Vie syndicale, Formation, Élections), union locale, document joint, épinglé, lien Facebook, source (site ou import Facebook), publié (oui/non). Page d'accueil : fil de cartes animées, plus récent en haut, publication épinglée en tête avec bannière animée, chargement progressif par paquets de 10 au scroll avec squelettes animés, filtres par thème. Une page par publication avec adresse partageable et galerie photo plein écran. Règles de sécurité : lecture publique des publications publiées, écriture réservée aux rédacteurs. Ajoute 5 publications d'exemple.

**Étape 3 — Les pages fixes.**

> Crée les pages Contact (coordonnées de l'UD et des unions locales avec adresse, téléphone, permanences, carte OpenStreetMap, et formulaire de contact), Agenda (événements à venir avec date et lieu, compteur à rebours vers le prochain) et Adhérer (lien vers l'adhésion en ligne CGT), plus Mentions légales/RGPD. Les UL et l'agenda sont stockés dans Firestore.

**Étape 4 — Mode administrateur.**

> Crée un mode administrateur sur /admin protégé par Firebase Authentication, réservé aux comptes ayant le rôle rédacteur ou administrateur (custom claims). Interface façon « Créer une publication » de Facebook : zone de texte, ajout de photos par glisser-déposer ou appareil photo avec envoi vers Storage, choix du thème, case épingler, aperçu, publier. Liste des publications avec modifier, dépublier, supprimer. Gestion de l'agenda et des UL. Bouton « Copier le lien pour Facebook » après publication. L'administrateur peut ajouter ou retirer des rédacteurs. Installe l'extension Resize Images pour les miniatures.

**Étape 5 — Réactions, partage, contact.**

> Ajoute sur chaque publication un bouton de réaction ✊ anonyme avec compteur dans Firestore, une réaction par navigateur, sans cookie de suivi, protégé par Firebase App Check. Ajoute des boutons de partage WhatsApp, Facebook, e-mail et copier le lien. Branche le formulaire de contact sur l'extension Trigger Email pour envoyer le message à l'adresse de l'UD, avec anti-spam sans CAPTCHA visible. Ajoute une Cloud Function sur les pages publication qui génère les balises Open Graph (titre, photo, résumé) pour un bel aperçu sur Facebook et WhatsApp. Rends le site installable (PWA).

**Étape 6 — Import des posts Facebook.**

> Voici l'export JSON des informations de notre Page Facebook (dossier joint). Écris un script Node avec firebase-admin qui lit les posts du dernier mois, crée une publication Firestore pour chacun (texte, date, thème par défaut « Vie syndicale », source « import Facebook »), envoie les photos dans Storage, ignore les doublons et me montre un récapitulatif avant d'écrire. Prévois un mode test qui n'écrit rien.

**Conseil :** demande à Claude Code de commencer chaque session par lire le CLAUDE.md, et de le mettre à jour à la fin.

## Budget, RGPD et décisions

Le coût fixe se limite au nom de domaine, environ 10 à 15 € par an ; Firebase reste dans son quota gratuit à notre volume, avec une alerte budget pour éviter toute surprise.

**RGPD :**

- pas de cookies publicitaires ni de suivi, donc pas de bandeau cookies ;
- mesure d'audience, si on en veut une, avec un outil sans cookie (Cloudflare Web Analytics ou Plausible) ;
- formulaire de contact : les messages arrivent par e-mail à l'UD et sont supprimés de Firestore après envoi (durée de conservation à fixer) ;
- droit à l'image : accord des personnes reconnaissables sur les photos, surtout en entreprise ;
- mentions légales avec le directeur de publication (le ou la secrétaire générale de l'UD, à confirmer).

**À valider en Bureau UD :**

- [ ] Accord sur le principe « le site d'abord, Facebook ensuite »
- [ ] Choix des 2 ou 3 rédacteurs
- [ ] Nom de domaine et récupération éventuelle de l'ancien
- [ ] Directeur de publication
- [ ] Liste des unions locales et syndicats à faire figurer, avec leurs coordonnées
- [ ] Liste des thèmes du fil
- [ ] Respect de la charte graphique confédérale

* [ ] Lancer l'export des posts Facebook du dernier mois
* [ ] Création du compte Google, du projet Firebase et du dépôt GitHub au nom de l'UD
