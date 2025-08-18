// Service Worker for PDFo - Optimized for 100% Performance Score
const CACHE_NAME = 'pdfo-v1.0.0';
const STATIC_CACHE_NAME = 'pdfo-static-v1.0.0';

// Resources to cache immediately
const CRITICAL_RESOURCES = [
  '/',
  '/index.html',
  '/src/main.tsx',
  '/src/index.css',
  '/pdf.worker.min.js',
];

// Resources to cache on first access
const RUNTIME_CACHE = [
  '/merge',
  '/split',
  '/compress',
  '/pdf-to-jpg',
  '/pdf-to-png',
  '/about',
  '/contact',
];

// Install event - cache critical resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        return cache.addAll(CRITICAL_RESOURCES);
      }),
    ])
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - cache strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (url.origin !== self.location.origin) {
    return;
  }

  // Cache strategy for different resource types
  if (request.destination === 'document' || url.pathname.endsWith('/')) {
    // HTML pages - Network first with cache fallback
    event.respondWith(
      fetch(request)
        .then((response) => {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  } else if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'font' ||
    url.pathname.includes('.js') ||
    url.pathname.includes('.css') ||
    url.pathname.includes('.woff') ||
    url.pathname.includes('.worker')
  ) {
    // Static assets - Cache first with network fallback
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((response) => {
          const responseClone = response.clone();
          caches.open(STATIC_CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
          return response;
        });
      })
    );
  } else if (request.destination === 'image') {
    // Images - Cache first with network fallback and long expiry
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(request).then((response) => {
            const responseClone = response.clone();
            caches.open(STATIC_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
        );
      })
    );
  }
});

// Background sync for analytics (optional)
self.addEventListener('sync', (event) => {
  if (event.tag === 'analytics-sync') {
    event.waitUntil(
      // Send cached analytics events when online
      self.registration.sync.register('analytics-sync')
    );
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo.png',
      badge: '/logo.png',
    });
  }
});