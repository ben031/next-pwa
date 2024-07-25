/**
 * 캐시를 여는 함수
 * @param cacheName - 캐시 이름
 * @returns 캐시 객체
 */
export async function openCache(cacheName: string): Promise<Cache> {
  return await caches.open(cacheName);
}

/**
 * 캐시 데이터를 저장하는 함수
 * @param cacheName - 캐시 이름
 * @param url - 캐시에 저장할 데이터의 URL
 * @param data - 캐시에 저장할 데이터
 */
export async function cacheData<T>(
  cacheName: string,
  url: string,
  data: T
): Promise<void> {
  const cache = await openCache(cacheName);
  const response = new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
  await cache.put(url, response);
}

/**
 * 캐시된 데이터를 가져오는 함수
 * @param cacheName - 캐시 이름
 * @returns 캐시된 데이터 배열
 */
export async function getCachedData<T>(cacheName: string): Promise<T[]> {
  const cache = await openCache(cacheName);
  const cachedData: T[] = [];
  const requests = await cache.keys();

  for (const request of requests) {
    const response = await cache.match(request);
    if (response) {
      const data: T = await response.json();
      cachedData.push(data);
    }
  }

  return cachedData;
}
