/* Service worker: permite abrir la app sin señal.
   Cambia VERSION cada vez que subas un index.html nuevo. */
const VERSION = 'inv-v22';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png', './xlsx.full.min.js', './jspdf.umd.min.js', './jspdf.plugin.autotable.min.js', './logo.png', './logo-ag.png', './logo-icon.png', './logo-txt.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(async c => {
    await c.addAll(SHELL);
  }));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (url.origin !== self.location.origin) return;   // solo se guardan archivos propios de la app; nada de Microsoft ni de terceros

  // Página principal: intenta red (para tener la última versión) y si no hay señal usa la copia guardada
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(r => {   // siempre revisa si hay versión nueva
      if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put('./index.html', cp)); } return r;
    }).catch(() => caches.match('./index.html')));
    return;
  }
  // Resto (íconos, librería Excel): caché primero
  e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(r => {
    if (r.ok) { const cp = r.clone(); caches.open(VERSION).then(c => c.put(req, cp)); }
    return r;
  })));
});
