self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open('sc-static');
    await cache.addAll(['/offline']);
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    try {
      return await fetch(event.request);
    } catch (e) {
      const cache = await caches.open('sc-static');
      const cached = await cache.match('/offline');
      return cached || new Response('Offline');
    }
  })());
});
