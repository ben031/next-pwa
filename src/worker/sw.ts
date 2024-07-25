import { defaultCache } from '@serwist/next/worker';
import type {
  PrecacheEntry,
  RouteHandlerCallbackOptions,
  SerwistGlobalConfig,
} from 'serwist';
import { Serwist, RuntimeCaching } from 'serwist';

// This declares the value of `injectionPoint` to TypeScript.
// `injectionPoint` is the string that will be replaced by the
// actual precache manifest. By default, this string is set to
// `"self.__SW_MANIFEST"`.
declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    ...defaultCache,
    {
      matcher: /\/test[1-3]/i,
      handler: async ({ request }) => {
        const cache = await caches.open('test-pages-cache');
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // 네트워크 실패 시 캐시된 오프라인 페이지 반환
          const offlineCache = await caches.open('offline-cache');
          const offlineResponse = await offlineCache.match('/offline.html');
          if (offlineResponse) {
            return offlineResponse;
          }
          return new Response('Offline', { status: 503 });
        }
      },
    },
    {
      matcher: /\/data\/.*/i,
      handler: async ({ request }) => {
        const cache = await caches.open('dynamic-data-cache');
        const cachedResponse = await cache.match(request);

        if (cachedResponse) {
          return cachedResponse;
        }

        try {
          const networkResponse = await fetch(request);
          if (networkResponse) {
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        } catch (error) {
          // 네트워크 실패 시 캐시된 오프라인 페이지 반환
          const offlineCache = await caches.open('offline-cache');
          const offlineResponse = await offlineCache.match('/offline.html');
          if (offlineResponse) {
            return offlineResponse;
          }
          return new Response('Offline', { status: 503 });
        }
      },
    },
  ],
});

serwist.addEventListeners();

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const cachedResponse = await caches.match(event.request);
          if (cachedResponse) {
            return cachedResponse;
          }
          const networkResponse = await fetch(event.request);
          const cache = await caches.open('dynamic-cache');
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          const cache = await caches.open('offline-cache');
          const cachedResponse = await cache.match('/offline.html');
          if (cachedResponse) {
            return cachedResponse;
          }
          return new Response('Offline', { status: 503 });
        }
      })()
    );
  } else {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return (
          cachedResponse ||
          fetch(event.request).catch(
            () => new Response('Offline', { status: 503 })
          )
        );
      })
    );
  }
});
