// Service worker de CURĂȚARE (5 nov. 2026): aplicația nu mai folosește service worker.
// Telefoanele care îl instalaseră primesc acest fișier, își șterg memoria salvată și se dezînregistrează; de la următoarea deschidere aplicația se încarcă direct de pe server, ca înainte.
// Nu se șterge acest fișier până când toate telefoanele au trecut pe el.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    for (const k of await caches.keys()) await caches.delete(k);
    await self.registration.unregister();
    const all = await self.clients.matchAll({ type: "window" });
    all.forEach((c) => { try { c.navigate(c.url); } catch(e){} });
  })());
});
// niciun fetch interceptat: totul merge direct la server
