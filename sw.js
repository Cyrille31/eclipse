/* Cache hors ligne de « Sur la trace des éclipses » — CGExcel.
   Stratégie: on sert d'abord la copie locale, puis on rafraîchit en arrière-plan.
   L'application s'ouvre donc instantanément et sans réseau ; une version
   nouvellement publiée est prise en compte au chargement suivant.
   Hors ligne, toute ouverture de page (même avec des paramètres dans l'adresse)
   retombe sur la copie locale de l'atlas : l'application reste utilisable sur
   le terrain, sans réseau. */
var CACHE = 'eclipses-v3.0.1';
var FICHIERS = ['./', './index.html', './manifest.webmanifest',
                './icon-192.png', './icon-512.png', './icon-maskable-512.png',
                './confidentialite.html',
                './fonts/fonts.css',
                './fonts/ibm-plex-mono-400-latin-ext.woff2',
                './fonts/ibm-plex-mono-400-latin.woff2',
                './fonts/ibm-plex-mono-500-latin-ext.woff2',
                './fonts/ibm-plex-mono-500-latin.woff2',
                './fonts/spectral-300-italic-latin-ext.woff2',
                './fonts/spectral-300-italic-latin.woff2',
                './fonts/spectral-300-latin-ext.woff2',
                './fonts/spectral-300-latin.woff2',
                './fonts/spectral-400-latin-ext.woff2',
                './fonts/spectral-400-latin.woff2',
                './fonts/spectral-600-latin-ext.woff2',
                './fonts/spectral-600-latin.woff2'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      // cache:'reload' : on va chercher la version du serveur, pas une copie
      // éventuellement périmée gardée par le cache HTTP du navigateur.
      .then(function (c) {
        return c.addAll(FICHIERS.map(function (u) { return new Request(u, { cache: 'reload' }); }));
      })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys()
      .then(function (noms) {
        return Promise.all(noms.filter(function (n) { return n !== CACHE; })
                                .map(function (n) { return caches.delete(n); }));
      })
      .then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var r = e.request;
  if (r.method !== 'GET') return;
  var url = new URL(r.url);
  if (url.origin !== location.origin) return;   // ressources externes: on laisse passer
  var page = r.mode === 'navigate';
  e.respondWith(
    // Pour une page, on ignore les paramètres (?utm_source=…) : ils ne changent
    // rien au contenu et ne doivent pas empêcher l'ouverture hors ligne.
    caches.match(r, { ignoreSearch: page }).then(function (copie) {
      var reseau = fetch(r).then(function (rep) {
        if (rep && rep.ok && !url.search) {
          var clone = rep.clone();
          caches.open(CACHE).then(function (c) { c.put(r, clone); });
        }
        return rep;
      }).catch(function () {
        // Pas de réseau : la copie locale, ou à défaut l'atlas lui-même.
        return copie || (page ? caches.match('./') : undefined);
      });
      return copie || reseau;
    })
  );
});
