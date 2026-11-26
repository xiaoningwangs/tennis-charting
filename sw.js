// Offline support. Bump CACHE_VERSION whenever you publish a new version of the app.
const CACHE_VERSION = 'v3';
const CACHE = 'tennis-recorder-' + CACHE_VERSION;
const SHELL = ['./', './index.html', './manifest.json', './icons/icon-192.png', './icons/icon-512.png', './icons/apple-touch-icon.png'];
const TAILWIND = 'https://cdn.tailwindcss.com';   // styling script, cached on first online visit
const fresh = url => new Request(url, { cache: 'reload' });   // bypass the browser's own HTTP cache so we always get the newest files

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(CACHE);
    await Promise.all(SHELL.map(async u => c.put(u, await fetch(fresh(u)))));
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

const sig = r => r && r.headers && (r.headers.get('etag') || r.headers.get('last-modified'));
async function tellClients() { for (const cl of await self.clients.matchAll()) cl.postMessage({ type: 'UPDATE_READY' }); }

// Serve from cache immediately (works with no signal); refresh in the background and tell the page if the app file changed.
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url), own = url.origin === location.origin;
  if (req.method !== 'GET' || !(url.href === TAILWIND || own)) return;
  e.respondWith((async () => {
    const c = await caches.open(CACHE);
    const hit = await c.match(req, { ignoreSearch: true });
    const net = fetch(own ? fresh(req.url) : req).then(async r => {
      if (r && (r.ok || r.type === 'opaque')) {
        const changed = hit && own && sig(hit) && sig(r) && sig(hit) !== sig(r);
        await c.put(req, r.clone());
        if (changed) tellClients();
      }
      return r;
    }).catch(() => null);
    if (hit) { e.waitUntil(net); return hit; }
    return (await net) || (req.mode === 'navigate' ? c.match('./index.html') : Response.error());
  })());
});
