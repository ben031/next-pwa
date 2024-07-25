/**
 * 캐시 데이터를 저장하는 함수
 * @param url - 캐시에 저장할 데이터의 URL
 * @param data - 캐시에 저장할 데이터
 */
export async function cacheData(
  url: string,
  data: { [key: string]: any }
): Promise<void> {
  const cache = await caches.open('dynamic-data-cache');
  const response = new Response(JSON.stringify(data), {
    headers: { 'Content-Type': 'application/json' },
  });
  await cache.put(url, response);
}
