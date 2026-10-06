# Publication sur Google Play — « Sur la trace des éclipses »

Ce dossier rassemble tout ce qu'il faut pour publier l'application sur Google Play
(compte développeur **CGExcel**, compte entreprise).

| Élément | Où |
|---|---|
| Politique de confidentialité | `../confidentialite.html` → https://cyrille31.github.io/eclipse/confidentialite.html |
| Textes de la fiche Play | ci-dessous |
| Captures d'écran (1082×1922), FR et EN | `captures/` |
| Image de présentation (1024×500) | `image-presentation-1024x500.png` |
| Logo retenu (A) et autres propositions | `../icon.svg`, `propositions-logo/` |
| Modèle `assetlinks.json` pour `cyrille31.github.io` | `depot-cyrille31.github.io/` (voir `../PUBLICATION.md` §6) |

---

## Étapes

La procédure complète (Bubblewrap, clé de signature, assetlinks.json, test sur téléphone, mises à
jour) est décrite dans **[`../PUBLICATION.md`](../PUBLICATION.md)**. Ce dossier ne contient plus que
les éléments de la fiche du Store et les réponses aux questionnaires de la Play Console.

Nom de paquet : `io.github.cyrille31.eclipses`.

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
- Icône 512×512 : `../icon-512.png`.
- Image de présentation 1024×500 : `image-presentation-1024x500.png`.
- Captures de téléphone : les 4 fichiers `captures/fr-*.png` (fiche française) et `captures/en-*.png` (fiche anglaise).
- Textes : voir ci-dessous.

### 6. Production
Voir `../PUBLICATION.md`, §8 à §10.

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
> déterministe. Aucun compte, aucune autorisation, aucun traceur. Après une première ouverture
> connectée, l'application fonctionne entièrement sans réseau, idéal sur le terrain.
>
> Pour les passionnés d'astronomie, les curieux d'histoire (quelle éclipse a assombri le ciel
> de vos ancêtres ?), les enseignants, et tous ceux qui préparent déjà leur prochain voyage
> sous l'ombre de la Lune.
>
> Disponible en français et en anglais.
>
> Conçue par CGExcel. Licence libre MIT.

**Notes de version 3.0**

> Première version publiée sur Google Play. Nouvelle icône, interface disponible en anglais.
> Polices intégrées : l'application fonctionne désormais entièrement hors ligne, sans aucune
> connexion à des services tiers.

---

## Fiche en anglais (facultatif mais recommandé)

L'application ayant désormais une interface anglaise, ajoutez une traduction de la fiche :
*Présence sur le Play Store → Fiche principale → Gérer les traductions → Ajouter vos propres
traductions → English (United States) – en-US* (et éventuellement en-GB). Les images peuvent être
les mêmes.

**App name**

> On the Trail of Eclipses

**Short description**

> Atlas of total solar eclipse paths from the year 1000 to the year 3000.

**Full description**

> On the Trail of Eclipses is an interactive atlas of every path of totality of solar eclipses
> (total and hybrid) that has swept or will sweep across the Earth between the years 1000 and 3000.
>
> Each path is drawn at its true width. Where the Moon's shadow has passed several times, the inks
> overlap: you can see at a glance which regions of the world are most often plunged into night
> in broad daylight.
>
> ◆ FLAT MAP AND GLOBE
> Switch between a world map and a globe you spin with your finger. Zoom down to about 2 km to
> find out whether your town was — or will be — inside the path.
>
> ◆ THE ECLIPSE COMB
> A timeline where the height of each line shows the duration of totality. Pick a century or the
> whole period, tap an eclipse and its track appears on the map.
>
> ◆ FOR EACH ECLIPSE
> Date, central duration, path width, point of greatest eclipse and type (total or hybrid). Long
> press anywhere to see what an observer would have seen there: time, duration of totality,
> fraction of the Sun covered, Sun altitude and azimuth.
>
> ◆ OFFLINE, AD-FREE, NO DATA COLLECTION
> All calculations run on your device, using a deterministic astronomical calculation. No account,
> no permissions, no trackers. After a first launch with a connection, the app works entirely
> offline, perfect in the field.
>
> Available in French and English.
>
> For astronomy enthusiasts, history buffs (which eclipse darkened your ancestors' sky?),
> teachers, and everyone already planning their next trip under the Moon's shadow.
>
> Designed by CGExcel. Free software, MIT licence.

**Release notes 3.0**

> First release on Google Play. New icon, English interface, embedded fonts: the app now works
> entirely offline, without any connection to third-party services.
