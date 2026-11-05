# CGT Aveyron

Site de l'Union départementale CGT de l'Aveyron : fil d'actualités, agenda, contact et adhésion.

## Démarrer en local

```bash
npm install
npm run dev
```

## Mettre en ligne automatiquement (à faire une fois)

Le site se déploie tout seul sur Firebase Hosting à chaque modification de la branche `principal`. Il faut pour cela donner à GitHub une clé du projet Firebase :

1. Dans la [console Google Cloud du projet cgtaveyron](https://console.cloud.google.com/iam-admin/serviceaccounts?project=cgtaveyron), créer un compte de service avec le rôle **Administrateur Firebase Hosting** (et **Utilisateur de compte de service**), puis créer une clé JSON.
2. Dans GitHub : **Settings → Secrets and variables → Actions → New repository secret**, nom `FIREBASE_SERVICE_ACCOUNT_CGTAVEYRON`, valeur = tout le contenu du fichier JSON.
3. Dans la console Firebase : **Hosting → Commencer** pour activer l'hébergement.

Plus simple, depuis un ordinateur avec Node : `npx firebase login` puis `npx firebase init hosting:github` crée le compte de service et le secret à votre place (répondre « non » quand il propose de remplacer les fichiers de workflow existants).

Déploiement manuel possible à tout moment : `npm run build && npx firebase deploy --only hosting`.
