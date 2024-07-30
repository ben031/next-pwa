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

const PRE_CACHE_NAME = 'serwist-percache-v2';

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

const queue = new BackgroundSyncQueue('myQueueName', {
  onSync: () => {},
});

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

  event.respondWith(
    (async () => {
      const cache = await caches.open(PRE_CACHE_NAME);
      if (isOffline || !navigator.onLine) {
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }
      }

      // 네트워크 요청 시도
      try {
        const networkResponse = await fetch(event.request);
        // 요청 성공 시 캐시에 데이터 저장
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        // 네트워크 요청 실패 시 캐시된 데이터 반환
        const cachedResponse = await cache.match(event.request);
        if (cachedResponse) {
          return cachedResponse;
        }

        // 모든 경우에 실패 시 기본 응답 제공 (필요에 따라 수정)
        return new Response('Offline and no cache available', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      }
    })()
  );
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

// 온라인 전환시 POST, PUT 메서드 queue 실행(TODO: 온라인 전환하는 이벤트로 내부 처리 옮겨야 함)
// self.addEventListener('sync', (event) => {
//   if (event.tag === 'myQueueName') {
//     event.waitUntil(
//       queue
//         .replayRequests()
//         .then(() => {
//           console.log('All queued requests have been replayed');
//         })
//         .catch((error) => {
//           console.error('Failed to replay queued requests', error);
//         })
//     );
//   }
// });

serwist.addEventListeners();
