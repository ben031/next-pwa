import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { BackgroundSyncQueue, Serwist } from 'serwist';

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

self.skipWaiting();

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  precacheOptions: {
    cleanupOutdatedCaches: true,
    concurrency: 20,
  },
  skipWaiting: true, // 서비스 워커가 설치되자마자 바로 활성화될지 여부를 설정
  clientsClaim: true, // 서비스 워커가 모든 열려 있는 웹 페이지에 바로 적용될지 여부를 설정
  runtimeCaching: defaultCache,
  disableDevLogs: true,
});

let isOffline = false;

const queue = new BackgroundSyncQueue('myQueueName');

self.addEventListener('fetch', async (event) => {
  const offlineMode = event.request.headers.get('offline-mode');

  if (event.request.method === 'POST' || event.request.method === 'PUT') {
    if (offlineMode === 'true') {
      await queue.pushRequest({ request: event.request });
      return Response.error();
    }

    const backgroundSync = async () => {
      try {
        const response = await fetch(event.request.clone());
        return response;
      } catch (error) {
        await queue.pushRequest({ request: event.request });
        return Response.error();
      }
    };

    event.respondWith(backgroundSync());

    return;
  }

  if (isOffline || !navigator.onLine) {
    event.respondWith(
      (async () => {
        try {
          const { route, params } = serwist.findMatchingRoute({
            url: new URL(event.request.url),
            event: event,
            request: event.request,
            sameOrigin: new URL(event.request.url).origin === location.origin,
          });

          if (route) {
            return route.handler.handle({
              event,
              params,
              request: event.request,
              url: new URL(event.request.url),
            });
          }

          return Response.error();
        } catch (e) {
          return Response.error();
        }
      })()
    );
  }
});

self.addEventListener('offline', () => {
  isOffline = true;
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: 'MANUAL_STATUS_UPDATED',
        payload: isOffline,
      });
    });
  });
});

self.addEventListener('message', (event) => {
  if (event.data.payload === 'offline') {
    isOffline = true;
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'MANUAL_STATUS_UPDATED',
          payload: isOffline,
        });
      });
    });
  }

  if (event.data.payload === 'online') {
    isOffline = false;
    self.clients.matchAll().then((clients) => {
      clients.forEach((client) => {
        client.postMessage({
          type: 'MANUAL_STATUS_UPDATED',
          payload: isOffline,
        });
      });
    });

    event.waitUntil(
      queue
        .replayRequests()
        .then(() => {
          console.log('All queued requests have been replayed');
        })
        .catch((error) => {
          console.error('Failed to replay queued requests', error);
        })
    );
  }
});

serwist.addEventListeners();
