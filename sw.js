/* Cache hors ligne de « Sur la trace des éclipses » — CGExcel.
   Stratégie: on sert d'abord la copie locale, puis on rafraîchit en arrière-plan.
   L'application s'ouvre donc instantanément et sans réseau ; une version
   nouvellement publiée est prise en compte au chargement suivant. */
var CACHE = 'eclipses-v1.0';
var FICHIERS = ['./', './index.html', './manifest.webmanifest',
                './icon-192.png', './icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(FICHIERS); })
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
  if (new URL(r.url).origin !== location.origin) return;   // polices distantes: on laisse passer
  e.respondWith(
    caches.match(r).then(function (copie) {
      var reseau = fetch(r).then(function (rep) {
        if (rep && rep.ok) {
          var clone = rep.clone();
          caches.open(CACHE).then(function (c) { c.put(r, clone); });
        }
        return rep;
      }).catch(function () { return copie; });
      return copie || reseau;
    })
  );
});
