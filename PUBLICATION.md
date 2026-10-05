# Publier et mettre à jour « Sur la trace des éclipses » sur Google Play

Guide de référence de **CGExcel** (Cyrille Gindre). Il couvre la première publication de l'application
Android (TWA, *Trusted Web Activity*) et toutes les mises à jour qui suivront. Il est écrit pour quelqu'un
qui n'est pas développeur Android : chaque commande est expliquée.

> **La règle d'or en une phrase.** Changer le contenu de l'atlas ne demande **qu'un commit** dans ce dépôt.
> Republier sur le Play Store n'est nécessaire que si l'on change **l'enveloppe Android** : nom, icône,
> couleurs, nom de paquet, ou mise à niveau annuelle exigée par Google. Détail au §10.

---

## 0. Comment ça marche

L'application Android n'est qu'une **fenêtre plein écran sur le site** `https://cyrille31.github.io/eclipse/`.
Elle ne contient pas l'atlas : elle l'ouvre dans le moteur de Chrome, sans barre d'adresse. Chrome n'accepte
de masquer la barre d'adresse que si le site « reconnaît » l'application. C'est le rôle du fichier
`assetlinks.json` (§6), qui contient l'empreinte de la clé ayant signé l'application.

| Quoi | Où | Publié ? |
|---|---|---|
| L'atlas (HTML, données, service worker) | ce dépôt `Cyrille31/eclipse` → GitHub Pages | oui |
| Configuration de référence de l'appli Android | `android/twa-manifest.json` (ce dépôt) | oui, sans aucun secret |
| Projet Android complet généré par Bubblewrap | votre ordinateur : `C:\CGExcel\eclipses-android\` | **non** |
| **Clé de signature** (`eclipses-upload.keystore`) | votre ordinateur : `C:\CGExcel\CGExcel-cles\` | **JAMAIS** |
| Mots de passe de la clé | votre gestionnaire de mots de passe | **JAMAIS** |
| `assetlinks.json` | dépôt `Cyrille31/cyrille31.github.io`, dossier `.well-known/` | oui (c'est public par nature) |

Valeurs fixées une fois pour toutes :

| Paramètre | Valeur |
|---|---|
| Nom de paquet (*Application ID*) | `io.github.cyrille31.eclipses`. **Définitif** : il ne pourra jamais être changé sur Google Play. |
| Nom de l'application | `Sur la trace des éclipses` |
| Nom court (sous l'icône) | `Éclipses` |
| Couleurs (barre d'état, fond de l'écran de démarrage, barre de navigation) | `#DEDCD2`, le papier de l'atlas |
| Première version | `versionCode` 1, `versionName` 3.0 (même numéro que l'atlas) |
| Alias de la clé | `eclipses` |
| Politique de confidentialité | https://cyrille31.github.io/eclipse/confidentialite.html |

---

## 1. Préparer votre ordinateur (une seule fois)

### 1.1 Installer Node.js
Bubblewrap est un programme écrit en JavaScript, qui fonctionne avec **Node.js**.
Téléchargez la version **LTS** sur https://nodejs.org et installez-la avec les options par défaut.

Ouvrez ensuite un **terminal** :
- **Windows 11** : menu Démarrer, tapez « **cmd** », ouvrez l'**Invite de commandes**. Préférez-la à
  PowerShell : sous Windows 11, PowerShell bloque par défaut les scripts comme `bubblewrap`
  (erreur « l'exécution de scripts est désactivée sur ce système ») ;
- **Mac** : application *Terminal*.

Vérifiez l'installation :
```
node -v
```
Un numéro de version doit s'afficher (par exemple `v22.x.x`).

### 1.2 Installer Bubblewrap
```
npm install -g @bubblewrap/cli
```
`npm` est l'installateur de programmes fourni avec Node.js, et `-g` rend la commande `bubblewrap`
utilisable depuis n'importe quel dossier. Sur Mac, si un message parle de permissions, relancez la
commande précédée de `sudo `.

### 1.3 Ce que Bubblewrap va installer la première fois (≈ 1 Go)
Au premier lancement (§2), Bubblewrap pose deux questions :

| Question | Réponse | Ce que ça installe |
|---|---|---|
| *Do you want Bubblewrap to install the JDK (recommended)?* | **Yes** | Java 17 (environ 190 Mo), le langage dans lequel les applications Android sont construites. Installé dans le dossier `.bubblewrap` de votre profil, sans toucher au reste du système. |
| *Do you want Bubblewrap to install the Android SDK (recommended)?* | **Yes** | Les outils Android de Google (plusieurs centaines de Mo) : compilation, signature. Même dossier. |
| *Do you agree to the Android SDK terms and conditions…?* | **Yes** | Acceptation de la licence de Google pour ces outils. |

Ces téléchargements prennent plusieurs minutes. Ils ne se font qu'une fois.

### 1.4 ⚠️ Windows : utiliser une Java 64 bits, dans un dossier sans espace
Sous Windows, Bubblewrap a deux défauts :
- il télécharge une Java **32 bits**, qui ne peut pas réserver la mémoire qu'exige la compilation
  Android. `bubblewrap build` échoue alors avec
  `Could not reserve enough space for 1572864KB object heap` ;
- il appelle Java sans guillemets. Une Java installée sous `C:\Program Files\…` fait échouer la
  signature avec `'C:\Program' n'est pas reconnu en tant que commande interne`.

Le remède, à faire une seule fois :
1. Installez **Temurin 17, Windows x64, JDK, fichier `.msi`** depuis
   https://adoptium.net/temurin/releases/?version=17&os=windows&arch=x64&package=jdk.
   Il faut exactement la version **17** : Bubblewrap refuse les autres.
2. Copiez-la dans un dossier sans espace (adaptez le numéro de version), puis indiquez-le à Bubblewrap :
   ```
   xcopy "C:\Program Files\Eclipse Adoptium\jdk-17.0.20.101-hotspot" C:\CGExcel\jdk-17 /E /I /H
   bubblewrap updateConfig --jdkPath=C:\CGExcel\jdk-17
   bubblewrap doctor
   ```
Le dossier `C:\Users\<vous>\.bubblewrap\jdk` (la Java 32 bits) peut ensuite être supprimé.

> 🔐 Quand une commande échoue, Bubblewrap peut afficher en clair la commande complète, **mots de passe
> compris**. Ne partagez jamais une telle capture sans masquer le mot de passe. Si cela arrive, changez
> le mot de passe (§4).

---

## 2. Créer le projet Android (une seule fois)

### 2.1 Créer deux dossiers séparés
Créez un dossier `C:\CGExcel` et, dedans :
- `eclipses-android` : le projet Android, que l'on peut régénérer à tout moment ;
- `CGExcel-cles` : la clé de signature, **précieuse**.

Dans l'Invite de commandes :
```
mkdir C:\CGExcel\eclipses-android
mkdir C:\CGExcel\CGExcel-cles
```
Pourquoi pas dans *Documents* ? Sous Windows 11, *Documents* est souvent synchronisé par OneDrive.
La compilation Android y est lente et peut échouer sur des fichiers verrouillés, et la clé partirait
dans le nuage sans que vous l'ayez décidé. Les chemins sans espaces évitent aussi des erreurs.

Ils sont volontairement séparés : vous pourrez effacer ou recréer le projet sans jamais risquer la clé.

### 2.2 Lancer l'assistant
Dans le terminal, placez-vous dans le dossier du projet :
```
cd C:\CGExcel\eclipses-android
```

Puis lancez :
```
bubblewrap init --manifest=https://cyrille31.github.io/eclipse/manifest.webmanifest
```
Bubblewrap lit le manifeste **du site en ligne**. La version publiée doit donc être la bonne : la
pull request avec la nouvelle icône doit avoir été fusionnée.

### 2.3 Réponses à donner
Appuyez sur **Entrée** pour accepter une valeur proposée, ou tapez la valeur indiquée.

| Question affichée | Réponse |
|---|---|
| Domain: | `cyrille31.github.io` (proposé) |
| URL path: | `/eclipse/` (proposé) |
| Application name: | `Sur la trace des éclipses` |
| Short name: | `Éclipses` |
| Application ID: | `io.github.cyrille31.eclipses` ⚠️ vérifiez bien, c'est définitif |
| Starting version code for the new app version: | `1` |
| Display mode: | `standalone` |
| Orientation: | `any` |
| Status bar color: | `#DEDCD2` (proposé) |
| Splash screen color: | `#DEDCD2` (proposé) |
| Icon URL: | `https://cyrille31.github.io/eclipse/icon-512.png` (proposé) |
| Maskable icon URL: | `https://cyrille31.github.io/eclipse/icon-maskable-512.png` (proposé) |
| Monochrome icon URL: | laisser vide, **Entrée** |
| Include support for Play Billing? | **No** (pas de paiement) |
| Request geolocation permission? | **No** (l'atlas n'utilise pas la position) |
| Key store location: | `C:\CGExcel\CGExcel-cles\eclipses-upload.keystore` |
| Key name: | `eclipses` |
| Do you want to create one now? | **Yes** |
| First and Last names: | `Cyrille Gindre` |
| Organizational Unit: | `CGExcel` |
| Organization: | `CGExcel` |
| Country (2 letter code): | `FR` |
| Password for the Key Store: | un mot de passe **fort**, voir ci-dessous |
| Password for the Key: | le même, ou un second |

🔐 **Mots de passe** : enregistrez-les **immédiatement** dans un gestionnaire de mots de passe
(Bitwarden, 1Password, KeePass, le gestionnaire de votre navigateur…). Ne les écrivez dans aucun fichier
de ce dépôt.

À la fin, le dossier `eclipses-android` contient le projet Android. Le dossier `CGExcel-cles` contient
`eclipses-upload.keystore` : c'est **votre clé**.

### 2.4 Réglages à corriger à la main
L'assistant ne pose pas toutes les questions. Ouvrez `eclipses-android/twa-manifest.json` avec le
Bloc-notes (Windows) ou TextEdit (Mac, en mode texte brut) et modifiez ces lignes :

| Ligne générée | À remplacer par | Pourquoi |
|---|---|---|
| `"appVersionName": "1",` | `"appVersionName": "3.0",` | Nom de version visible sur le Play Store. |
| `"appVersion": "1"` (**dernière ligne**, sans virgule) | `"appVersion": "3.0"` | ⚠️ C'est **cette** ligne que Bubblewrap lit réellement pour le nom de version ; `appVersionName` seul ne suffit pas. |
| `"navigationDividerColor": "#000000",` et `…Dark` | `"#DEDCD2"` | Facultatif : supprime le filet noir au-dessus de la barre de navigation. |
| `"enableNotifications": true,` | `"enableNotifications": false,` | L'atlas n'envoie pas de notifications : on évite une permission inutile. |
| `"themeColorDark": "#000000",` | `"themeColorDark": "#DEDCD2",` | Couleur de la barre d'état quand le téléphone est en mode sombre. |
| `"navigationColor": "#000000",` | `"navigationColor": "#DEDCD2",` | Barre de navigation Android, en bas de l'écran. |
| `"navigationColorDark": "#000000",` | `"navigationColorDark": "#DEDCD2",` | La même, en mode sombre. |

Le fichier `android/twa-manifest.json` de ce dépôt montre le résultat attendu. Seul le chemin de la clé
peut différer.

Enregistrez, puis appliquez les réglages au projet :
```
bubblewrap update --skipVersionUpgrade
```
`--skipVersionUpgrade` empêche Bubblewrap d'augmenter tout seul le numéro de version.

---

## 3. Construire l'application (AAB et APK)

Toujours dans `eclipses-android` :
```
bubblewrap build
```
Bubblewrap demande les deux mots de passe de la clé, compile, puis signe. Il produit deux fichiers dans
`eclipses-android` :

| Fichier | Usage |
|---|---|
| `app-release-bundle.aab` | **Pour le Play Store.** Le format exigé par Google. Il ne s'installe pas directement sur un téléphone. |
| `app-release-signed.apk` | **Pour vos tests** sur le Galaxy S23 (§7). |

Bubblewrap peut aussi lancer un contrôle de qualité de la PWA (score Lighthouse). C'est informatif.

---

## 4. La clé de signature : où elle est, et pourquoi la sauvegarder

- **Emplacement** : `C:\CGExcel\CGExcel-cles\eclipses-upload.keystore`, alias `eclipses`.
- **Mots de passe** : dans votre gestionnaire de mots de passe.
- **Elle n'est pas dans le dépôt, et ne doit jamais y aller.** Le fichier `.gitignore` du dépôt
  refuse en plus les fichiers `*.keystore`, `*.jks`, `*.aab` et `*.apk`. C'est un filet de sécurité :
  il ne protège que les envois faits avec git. **Il ne protège pas les dépôts faits par glisser-déposer
  dans le navigateur.** Ne glissez donc jamais le dossier `CGExcel-cles` ni le dossier `eclipses-android`
  dans GitHub.

**Sauvegardez la clé dès maintenant, en deux exemplaires hors de l'ordinateur**, par exemple sur une
clé USB rangée en lieu sûr et dans un coffre en ligne chiffré. Gardez les mots de passe séparés du
fichier.

**Changer le mot de passe** (par exemple s'il a été vu). L'empreinte de la clé ne change pas, donc
rien d'autre n'est à refaire. Le fichier n'a qu'un seul mot de passe, qui protège à la fois le fichier
et la clé :
```
C:\CGExcel\jdk-17\bin\keytool -storepasswd -keystore C:\CGExcel\CGExcel-cles\eclipses-upload.keystore
```

**Si vous la perdez.** Google Play signe lui-même l'application distribuée (« signature d'application
par Google Play », obligatoire pour les nouvelles applications). Votre fichier est une **clé
d'importation** : elle prouve à Google que c'est bien vous qui envoyez une mise à jour. Si vous la
perdez ou si elle est volée, vous pouvez demander sa **réinitialisation** dans la Play Console
(*Intégrité de l'application → Signature de l'application → Demander la réinitialisation de la clé
d'importation*). Comptez alors quelques jours sans pouvoir publier, puis il faudra mettre à jour
`assetlinks.json`. C'est réparable, mais pénible : sauvegardez-la.

---

## 5. Créer l'application dans la Play Console et envoyer l'AAB

1. https://play.google.com/console → **Créer une application** : nom `Sur la trace des éclipses`,
   langue par défaut **français (France)**, **Application**, **Gratuite**. Acceptez les déclarations.
2. *Tester et publier → Tests → **Test interne*** → *Créer une version*. Acceptez la **signature
   d'application par Google Play**, puis envoyez `app-release-bundle.aab`.
3. *Tester et publier → Configuration → **Intégrité de l'application*** → onglet *Signature de
   l'application*. Deux empreintes **SHA-256** y figurent :
   - *Certificat de la clé de signature d'application* : la clé de Google ;
   - *Certificat de la clé d'importation* : la vôtre.

   Vous en aurez besoin au §6.
4. Ajoutez votre adresse Gmail comme testeur interne. Ouvrez le lien de participation sur le S23 et
   installez l'application depuis le Play Store.

Les questionnaires à remplir et les textes de la fiche sont dans `google-play/README.md`.

---

## 6. assetlinks.json : faire disparaître la barre d'adresse

### 6.1 Produire le fichier
Il doit contenir **deux empreintes** :
- celle de **votre clé d'importation**, pour que l'APK de test du §7 fonctionne ;
- celle de **la clé de Google**, pour que l'application téléchargée sur le Play Store fonctionne.

Copiez les deux empreintes depuis la Play Console (§5.3). Elles ressemblent à
`AB:CD:12:…`, soit 32 paires séparées par des deux-points. Puis, dans `eclipses-android` :
```
bubblewrap fingerprint add AB:CD:...:EF --name=importation
bubblewrap fingerprint add 12:34:...:56 --name=google-play
```
Chaque commande enregistre l'empreinte dans `twa-manifest.json` et écrit un fichier `assetlinks.json`
à jour dans le dossier.

> **Tester avant d'envoyer quoi que ce soit à Google** : on peut lire l'empreinte de votre clé
> directement dans le fichier, avec l'outil `keytool` fourni avec Java :
> - **Windows** (Invite de commandes) :
>   `C:\CGExcel\jdk-17\bin\keytool -list -v -keystore C:\CGExcel\CGExcel-cles\eclipses-upload.keystore -alias eclipses`
> - **Mac** : `~/.bubblewrap/jdk/jdk-17…/Contents/Home/bin/keytool -list -v -keystore ../CGExcel-cles/eclipses-upload.keystore -alias eclipses`
>
> Copiez la ligne `SHA256:`.

Le résultat a cette forme (voir aussi le modèle `google-play/depot-cyrille31.github.io/.well-known/assetlinks.json`) :
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "io.github.cyrille31.eclipses",
    "sha256_cert_fingerprints": ["<empreinte importation>", "<empreinte Google Play>"]
  }
}]
```

### 6.2 Le déposer dans le dépôt `Cyrille31/cyrille31.github.io`, sans glisser-déposer
Le glisser-déposer du navigateur ignore les dossiers qui commencent par un point. GitHub permet
pourtant de **créer** le fichier directement :

1. Ouvrez https://github.com/Cyrille31/cyrille31.github.io.
2. **Add file → Create new file**.
3. Dans le champ du nom, tapez exactement : `.well-known/assetlinks.json`. Au moment où vous tapez
   le `/`, GitHub transforme `.well-known` en dossier : c'est normal.
4. Collez le contenu de votre `assetlinks.json` dans la grande zone de texte.
5. **Commit changes…** → **Commit changes**.
6. Recommencez avec un fichier nommé `.nojekyll`, laissé **vide**. Sans lui, GitHub Pages refuse de
   publier les dossiers qui commencent par un point.

Pour modifier le fichier plus tard : ouvrez-le sur GitHub, puis cliquez sur l'icône crayon (*Edit*).

### 6.3 Vérifier
1. Attendez 1 à 2 minutes, puis ouvrez https://cyrille31.github.io/.well-known/assetlinks.json dans un
   navigateur. Le texte JSON doit s'afficher tel quel, pas une page « 404 ».
2. Contrôle officiel de Google : ouvrez
   `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://cyrille31.github.io&relation=delegate_permission/common.handle_all_urls`.
   Votre `io.github.cyrille31.eclipses` et vos empreintes doivent y apparaître.
3. Sur le téléphone, lancez l'application : **aucune barre d'adresse ne doit apparaître en haut**.

Si la barre d'adresse reste visible :
- l'adresse du §6.3.1 n'affiche pas le fichier → il est mal placé, ou `.nojekyll` manque ;
- le nom de paquet est mal orthographié, ou l'empreinte de la clé qui a signé l'APK manque ;
- Chrome garde le résultat de sa vérification en mémoire → désinstallez l'application, puis
  *Paramètres → Applications → Chrome → Stockage → Vider le cache*, et réinstallez.

---

## 7. Installer l'APK sur le Galaxy S23 pour tester

1. **Transférez** `app-release-signed.apk` sur le téléphone. Le plus simple : envoyez-le sur Google
   Drive, ou par e-mail à vous-même. Autre solution : câble USB, puis copie dans le dossier
   *Téléchargements*.
2. Sur le S23, ouvrez le fichier depuis **Mes fichiers** (ou Drive, ou Gmail).
3. Samsung demande d'autoriser l'installation : **Paramètres → Autoriser depuis cette source**, pour
   l'application qui ouvre le fichier (*Mes fichiers*, *Drive*…). Revenez en arrière, puis
   **Installer**. Si Play Protect affiche un avertissement (« application inconnue »), choisissez
   *Plus de détails → Installer quand même* : c'est normal pour une appli qui ne vient pas encore du Store.
4. **Testez :**
   - l'icône « Éclipses » et l'écran de démarrage couleur papier ;
   - **pas de barre d'adresse** (§6.3) ;
   - **le hors-ligne** : ouvrez l'appli une fois en wifi et attendez que la carte s'affiche, puis
     passez en **mode Avion**, fermez complètement l'appli (balayez-la des applications récentes) et
     relancez-la. L'atlas doit fonctionner entièrement.
5. **Avant d'installer la version du Play Store, désinstallez l'APK de test.** Les deux versions ne
   sont pas signées par la même clé (la vôtre et celle de Google), et Android refuse de remplacer
   l'une par l'autre.

Bon à savoir pour le terrain : **la toute première ouverture exige du réseau**, le temps de mettre
l'atlas en cache (environ 1,7 Mo). Ensuite, tout fonctionne sans connexion.

---

## 8. Publier en production

Une fois les tests concluants et la fiche complète (`google-play/README.md`) : *Tester et publier →
**Production** → Créer une version* → **Ajouter depuis la bibliothèque** (le même AAB), choisissez les
pays, puis **Envoyer pour examen**. La première validation prend de quelques jours à une semaine.

---

## 9. Mettre à jour l'atlas : un simple commit suffit dans la plupart des cas

L'application Android affiche le site en ligne. **Toute modification publiée sur GitHub Pages arrive
toute seule sur les téléphones**, sans passer par le Play Store :

1. Modifiez les fichiers de ce dépôt (`index.html`…) et publiez-les (commit, ou dépôt par le navigateur).
2. **Si vous changez la liste des fichiers** de l'atlas (ajout, retrait ou renommage d'un fichier) :
   mettez-la à jour dans `sw.js` (tableau `FICHIERS`) **et** changez le nom du cache
   (`var CACHE = 'eclipses-v…'`). Pensez aussi à changer ce nom pour toute version importante : c'est
   ce qui déclenche le renouvellement complet du cache sur les téléphones.
3. Au lancement suivant **avec réseau**, l'application télécharge la nouvelle version en arrière-plan.
   Elle l'affiche au lancement d'après, ou recharge d'elle-même si le service worker a changé.

Le numéro « version 3.0 » affiché dans l'atlas est celui du **site**. Il est indépendant du
`versionName` Android (3.0 pour la première publication), qui ne change qu'avec une republication :
les deux peuvent donc diverger avec le temps.

---

## 10. Quand faut-il republier sur le Play Store ?

| Changement | Commit seul | Republication |
|---|:---:|:---:|
| Données, calculs, textes, traductions, mise en page de l'atlas | ✅ | |
| Correction de bug dans le site, nouvelle fonction web | ✅ | |
| Page de confidentialité | ✅ | |
| Icône de l'application Android, écran de démarrage | | ✅ |
| Nom ou nom court de l'application, couleurs des barres Android | | ✅ |
| Adresse du site (domaine, chemin `/eclipse/`) | | ✅ (et `assetlinks.json`) |
| Mise à niveau annuelle exigée par Google (*target API level*, en général avant fin août) | | ✅ |
| Nom de paquet | ❌ impossible : ce serait une nouvelle application |

Les textes et images de la **fiche** du Store (descriptions, captures) se modifient directement dans
la Play Console, sans republier l'application.

### Procédure de republication
Dans `C:\CGExcel\eclipses-android` :

1. **Mettre Bubblewrap à jour.** C'est indispensable pour la mise à niveau annuelle, car il intègre
   les exigences récentes de Google :
   ```
   npm install -g @bubblewrap/cli@latest
   ```
2. **Appliquer les changements et incrémenter la version.** L'icône est retéléchargée à chaque
   génération depuis son adresse (`iconUrl`) : une nouvelle icône publiée sur le site sous le même nom
   est donc prise en compte. Le nom, les couleurs et les autres réglages, eux, se lisent uniquement
   dans `twa-manifest.json` : modifiez-les là, avant de lancer la commande.
   ```
   bubblewrap update --appVersionName=3.0.1
   ```
   - `versionCode` est **augmenté automatiquement de 1** (1 → 2 → 3…). Google Play refuse tout envoi
     dont le `versionCode` n'est pas strictement supérieur au précédent. Ne le diminuez jamais, ne le
     réutilisez jamais.
   - `versionName` est le numéro visible par les utilisateurs. Convention : `3.0.1` pour une
     correction, `3.1` pour une évolution, `4.0` pour un changement majeur. Rien n'oblige à le
     faire correspondre au numéro affiché dans l'atlas, mais c'est plus lisible.
3. **Construire** : `bubblewrap build`, avec **la même clé** (`CGExcel-cles/eclipses-upload.keystore`).
4. **Envoyer** : Play Console → *Production* (ou d'abord *Test interne*) → *Créer une version* →
   envoyer le nouvel `app-release-bundle.aab` → notes de version → *Envoyer pour examen*.
5. Recopiez `twa-manifest.json` dans `android/twa-manifest.json` de ce dépôt, pour en garder une trace.
   Ce fichier ne contient aucun secret.

### Si vous changez d'ordinateur
Installez Node.js et Bubblewrap (§1), récupérez **la clé** depuis votre sauvegarde dans
`C:\CGExcel\CGExcel-cles\`, recopiez `android/twa-manifest.json` dans un nouveau dossier
`C:\CGExcel\eclipses-android\`, puis lancez :
```
bubblewrap update --skipVersionUpgrade
```
Le projet est régénéré à l'identique. Vérifiez que `appVersionCode` correspond bien à la dernière
version envoyée sur le Play Store.

---

## Récapitulatif

- [ ] Pull request de la nouvelle version fusionnée, site en ligne à jour
- [ ] Node.js et Bubblewrap installés (§1)
- [ ] Projet créé, clé générée dans `CGExcel-cles` (§2)
- [ ] **Clé et mots de passe sauvegardés en deux exemplaires** (§4)
- [ ] AAB et APK construits (§3)
- [ ] Application créée dans la Play Console, AAB envoyé en test interne (§5)
- [ ] `assetlinks.json` avec les deux empreintes et `.nojekyll` déposés sur `cyrille31.github.io` (§6)
- [ ] APK testé sur le S23 : pas de barre d'adresse, fonctionne en mode Avion (§7)
- [ ] Fiche et questionnaires remplis (`google-play/README.md`), envoi en production (§8)

Licence du projet inchangée : MIT + BAL 1.0 (Bonne Action License), voir `LICENSE`.
