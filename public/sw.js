// Service worker Davar: aplicația se pornește din memoria telefonului (HTML, scripturi, imagini, biblioteca), apoi se verifică în fundal dacă există o versiune nouă.
// Strategie: „stale-while-revalidate" doar pentru fișierele de pe același domeniu; /api/, fluxurile audio (Range) și domeniile externe nu sunt atinse.
const CACHE = "davar-shell-v1";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE) await caches.delete(k);
    await self.clients.claim();
  })());
});
async function notifyUpdate(url){
  const all = await self.clients.matchAll({ type: "window" });
  all.forEach(c => c.postMessage({ type: "davar-update", url }));
}
async function swr(event){
  const req = event.request;
  const cache = await caches.open(CACHE);
  const cached = await cache.match(req);
  const network = fetch(req).then(async (res) => {
    if(res && res.ok && res.type === "basic"){
      const oldTag = cached && (cached.headers.get("etag") || cached.headers.get("last-modified"));
      const newTag = res.headers.get("etag") || res.headers.get("last-modified");
      await cache.put(req, res.clone());
      if(cached && oldTag && newTag && oldTag !== newTag) notifyUpdate(req.url);
    }
    return res;
  }).catch(() => null);
  if(cached){ event.waitUntil(network); return cached; }
  const res = await network;
  return res || new Response("Fără conexiune.", { status: 503, headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if(req.method !== "GET" || req.headers.has("range")) return;
  const u = new URL(req.url);
  if(u.origin !== self.location.origin) return;
  if(u.pathname.indexOf("/api/") === 0 || u.pathname === "/sw.js") return;
  event.respondWith(swr(event));
});
