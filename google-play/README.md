# Publication sur Google Play — « Sur la trace des éclipses »

Ce dossier rassemble tout ce qu'il faut pour publier l'application sur Google Play
(compte développeur **CGExcel**, compte entreprise).

| Élément | Où |
|---|---|
| Politique de confidentialité | `../confidentialite.html` → https://cyrille31.github.io/eclipse/confidentialite.html |
| Textes de la fiche Play | ci-dessous |
| Captures d'écran (1082×1922) | `captures/` |
| Propositions de nouveau logo | `propositions-logo/` (`planche.png` pour comparer) |
| Contenu du dépôt `cyrille31.github.io` | `depot-cyrille31.github.io/` |

---

## Étapes

### 1. Générer l'application Android avec PWABuilder
1. Ouvrir https://www.pwabuilder.com et saisir `https://cyrille31.github.io/eclipse/`.
2. *Package for stores* → **Android** → *Generate Package*. Dans les options :
   - **Package ID** : `fr.cgexcel.eclipses` (définitif, ne pourra jamais changer) ;
   - **App name** : `Sur la trace des éclipses` ; **Short name** : `Éclipses` ;
   - **Version code** : `1` ; **Version name** : `3.0` ;
   - **Signing key** : *Create new* ; renseigner « CGExcel » comme organisation.
3. Télécharger le zip. Il contient :
   - `*.aab` → le fichier à envoyer sur Google Play ;
   - `signing.keystore` + `signing-key-info.txt` → **à sauvegarder en lieu sûr (2 copies au moins)** ;
   - `assetlinks.json` → contient l'empreinte de votre clé (« clé d'import »).

### 2. Créer le dépôt `cyrille31.github.io`
1. Sur GitHub, créer un dépôt **public** nommé exactement `cyrille31.github.io`.
2. Y déposer le contenu de `depot-cyrille31.github.io/` (y compris `.nojekyll`, fichier caché).
3. Dans `.well-known/assetlinks.json`, remplacer `REMPLACER_PAR_EMPREINTE_CLE_D_IMPORT_PWABUILDER`
   par l'empreinte SHA-256 du `assetlinks.json` fourni par PWABuilder.
4. *Settings → Pages* : source = branche `main`, dossier `/`.
5. Vérifier que https://cyrille31.github.io/.well-known/assetlinks.json s'affiche.

### 3. Créer l'application dans la Play Console
1. *Créer une application* : nom `Sur la trace des éclipses`, langue par défaut **français**,
   type **Application**, **Gratuite**.
2. *Tester et publier → Tests → Test interne* : créer une version, accepter **la signature
   d'application par Google Play**, envoyer le `.aab`.
3. *Tester et publier → Configuration → Intégrité de l'application → Signature de l'application* :
   copier l'**empreinte SHA-256 de la clé de signature d'application** et la coller à la place de
   `REMPLACER_PAR_EMPREINTE_CLE_DE_SIGNATURE_GOOGLE_PLAY` dans `assetlinks.json`.
4. Ajouter votre adresse Gmail comme testeur interne, installer l'appli depuis le lien de test et
   vérifier qu'**aucune barre d'adresse** n'apparaît (sinon : `assetlinks.json` incorrect).

### 4. Remplir le tableau de bord « Configurer l'application »
- **Règles de confidentialité** : `https://cyrille31.github.io/eclipse/confidentialite.html`
- **Accès à l'application** : tout est accessible sans restriction.
- **Annonces** : non, l'application ne contient pas d'annonces.
- **Classification du contenu** : catégorie « Référence, actualités ou éducation » ; répondre
  « non » à toutes les questions → classification tout public (PEGI 3).
- **Public cible** : cocher **13 ans et plus** (ne pas cocher les tranches enfants, pour éviter
  les obligations du programme Familles).
- **Sécurité des données** : « Votre application collecte-t-elle ou partage-t-elle des données
  utilisateur ? » → **Non**. (Aucune donnée n'est collectée : calculs locaux, pas de compte,
  pas de statistiques, polices désormais intégrées.)
- **Application d'actualités** : non. **Applications gouvernementales** : non.
- **Catégorie** : **Éducation** (ou *Livres et références*). Tags : astronomie, cartes.
- **Coordonnées** : e-mail `cgexcel.31@gmail.com` ; site `https://cyrille31.github.io/eclipse/`.

### 5. Fiche Play Store (*Croissance → Présence sur le Play Store → Fiche principale*)
- Icône 512×512 : `../icon-512.png` (ou le nouveau logo choisi).
- Image de présentation 1024×500 : à produire une fois le logo choisi.
- Captures de téléphone : les 4 fichiers de `captures/`.
- Textes : voir ci-dessous.

### 6. Production
*Tester et publier → Production → Créer une version* : reprendre le même `.aab` (bouton
« Ajouter depuis la bibliothèque »), choisir les pays (tous), puis **Envoyer pour examen**.
Premier examen : de quelques jours à une semaine.

### Mises à jour
Toute modification publiée sur GitHub Pages apparaît automatiquement dans l'application
(au lancement suivant). Il ne faut regénérer un `.aab` (avec la **même clé** et un *version code*
supérieur) que pour changer le nom, l'icône, les couleurs ou les réglages Android.

---

## Textes de la fiche

**Nom de l'application** (30 caractères max.)

> Sur la trace des éclipses

**Description courte** (80 caractères max.)

> Atlas des bandes de totalité des éclipses solaires, de l'an 1000 à l'an 3000.

**Description complète** (4 000 caractères max.)

> Sur la trace des éclipses est un atlas interactif de toutes les bandes de totalité des
> éclipses solaires (totales et hybrides) qui ont balayé ou balaieront la Terre entre l'an 1000
> et l'an 3000.
>
> Chaque bande de totalité est tracée à sa largeur réelle. Là où l'ombre de la Lune est passée
> plusieurs fois, les encres se superposent : on voit d'un coup d'œil les régions du monde les
> plus souvent plongées dans la nuit en plein jour.
>
> ◆ PLANISPHÈRE ET GLOBE
> Passez d'une carte du monde à un globe que l'on fait tourner du doigt. Zoomez jusqu'à une
> résolution d'environ 2 km pour savoir si votre ville était — ou sera — dans la bande.
>
> ◆ LE PEIGNE DES ÉCLIPSES
> Une frise chronologique où la hauteur de chaque trait indique la durée de totalité. Choisissez
> un siècle ou toute la période, touchez une éclipse : sa trajectoire s'affiche sur la carte.
>
> ◆ POUR CHAQUE ÉCLIPSE
> Date, durée au centre, largeur de la bande, point le plus favorable et type (totale ou hybride).
>
> ◆ HORS LIGNE, SANS PUBLICITÉ, SANS COLLECTE DE DONNÉES
> Tous les calculs sont effectués sur votre appareil, à partir d'un calcul astronomique
> déterministe. Aucun compte, aucune autorisation, aucun traceur. L'application fonctionne
> entièrement sans connexion.
>
> Pour les passionnés d'astronomie, les curieux d'histoire (quelle éclipse a assombri le ciel
> de vos ancêtres ?), les enseignants, et tous ceux qui préparent déjà leur prochain voyage
> sous l'ombre de la Lune.
>
> Conçue par CGExcel. Licence libre MIT.

**Notes de version 3.0**

> Première version publiée sur Google Play. Polices intégrées : l'application fonctionne
> désormais entièrement hors ligne, sans aucune connexion à des services tiers.
