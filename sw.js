// Offline support. Bump CACHE_VERSION whenever you publish a new version of the app.
const CACHE_VERSION = 'v2';
const CACHE = 'tennis-recorder-' + CACHE_VERSION;
const SHELL = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
const TAILWIND = 'https://cdn.tailwindcss.com';   // styling script, cached on first online visit

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await c.addAll(SHELL);
    try { await c.put(TAILWIND, await fetch(TAILWIND, { mode: 'no-cors' })); } catch (err) {}
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE && k.startsWith('tennis-recorder-')) await caches.delete(k);
    await self.clients.claim();
  })());
});

// Serve from cache immediately (works with no signal), refresh the cache in the background when online.
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET' || !(url.href === TAILWIND || url.origin === location.origin)) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(req).then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(req, r.clone()); return r; }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || (req.mode === 'navigate' ? c.match('./index.html') : Response.error());
  })());
});
