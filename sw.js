/* ATLAS service worker — offline support with network-first navigations so
   edits to the app always land. */
var CACHE = 'atlas-v1';
var FILES = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(FILES); })
      .then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (ks) {
      return Promise.all(ks.filter(function (k) { return k !== CACHE; })
        .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var r = e.request, u = new URL(r.url);
  if (r.method !== 'GET' || u.origin !== self.location.origin) return;
  if (r.cache === 'no-store' || r.cache === 'reload') return;

  // navigations & HTML: network first, cache only as an offline fallback
  var isDoc = r.mode === 'navigate' || (r.headers.get('accept') || '').indexOf('text/html') > -1;
  if (isDoc) {
    e.respondWith(
      fetch(r).then(function (res) {
        if (res && res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); }
        return res;
      }).catch(function () {
        return caches.match(r, { ignoreSearch: true })
          .then(function (hit) { return hit || caches.match('index.html'); });
      })
    );
    return;
  }

  // assets: cache first
  e.respondWith(
    caches.match(r, { ignoreSearch: true }).then(function (hit) {
      return hit || fetch(r).then(function (res) {
        if (res && res.ok) { var cp = res.clone(); caches.open(CACHE).then(function (c) { c.put(r, cp); }); }
        return res;
      });
    })
  );
});
