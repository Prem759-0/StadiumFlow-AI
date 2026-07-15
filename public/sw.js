// StadiumFlow AI - Service Worker for offline demo
const CACHE_NAME = "stadiumflow-v1";
const OFFLINE_URLS = ["/fan", "/dashboard"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(OFFLINE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);
  
  // 1. Bypass Service Worker for Firebase/Firestore internal communication & Google APIs
  const hostname = url.hostname;
  if (
    hostname.includes("fonts.gstatic.com") ||
    hostname.includes("apis.google.com") ||
    hostname.includes("googleapis.com") ||
    hostname.includes("firebaseio.com") ||
    hostname.includes("lh3.googleusercontent.com") ||
    url.pathname.startsWith("/__/") || // Firebase Auth (/auth/handler) and reserved
    url.pathname.startsWith("/_next/") || // Next.js internals
    url.pathname.includes("webpack-hmr") // HMR in dev mode
  ) {
    return;
  }

  // 2. Only provide fallbacks for navigation requests (HTML pages)
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((r) => {
          return r || caches.match("/fan");
        });
      })
    );
    return;
  }

  // 3. For other assets (JS, CSS, Images), use cache-first or network-only
  // but NEVER fallback to a different file type like HTML
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
