// ================================================================
// PROJETO STOPBULLYING — SERVICE WORKER (PWA OFFLINE CAPABILITY)
// EEMTI Nazaré Guerra — Ceará Científico 2026
// ================================================================

const CACHE_NAME = 'stopbullying-cache-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './supabase_client.js',
  './manifest.json',
  './Stop Bullying.jpeg',
  './Stop Bullying 2.jpeg',
  './Stop Bullying 3.jpeg',
  './banner_stopbullying_ceara_cientifico_2026.html',
  './gestaoequipestop.html'
];

// Instalação do Service Worker e Caching Inicial
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching arquivos estáticos...');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// Ativação e Limpeza de Caches Antigos
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removendo cache antigo:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Estratégia de Interceptação de Requisições (Cache First para Assets)
self.addEventListener('fetch', (event) => {
  // Ignorar requisições para extensões do navegador ou esquemas não-HTTP
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Salvar cópia no cache se for uma resposta válida de asset local
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        // Fallback offline genérico se a requisição falhar
        if (event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html');
        }
      });
    })
  );
});
