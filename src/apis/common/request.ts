import qs from 'qs';
import { APIError } from '@/apis/common/ApiError';
import { store } from '@/stores/store';

interface FetchParams {
  method: Method;
  requestBody?: unknown;
  queryParams?: unknown;
  url: string;
  config?: RequestInit;
}

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
};

/**
 * API 통신 함수
 * @param method HTTP 메서드
 * @param requestBody Request Body
 * @param queryParams Query Params
 * @param url 요청 URL
 * @param config fetch 설정 객체(next 등...)
 * @returns
 */
const request = async <T = any>({
  method,
  requestBody,
  queryParams,
  url,
  config = {},
}: FetchParams): Promise<T> => {
  const storeState = store.getState();

  const token =
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOjE3NiwiYWNjb3VudEhpc3RvcnlJZCI6MjQyNywic2VydmljZSI6IkJPU19XRUIiLCJpYXQiOjE3MjIyMTQ3OTR9.-VVhi0WEw2dP4TOWRTLOc093E9Bu9F5hYRjaTGsmGMY';

  const headers = {
    ...defaultHeaders,
    ...config.headers,
    ...(token ? { Authorization: token } : {}),
    ...(storeState?.network.manualStatus === 'online'
      ? {}
      : { 'offline-mode': 'true' }),
  };

  const params = queryParams
    ? `?${qs.stringify(queryParams, { arrayFormat: 'brackets' })}`
    : '';
  const fullUrl = `${url}${params}`;

  const fetchConfig: RequestInit = {
    method,
    headers,
    body: requestBody ? JSON.stringify(requestBody) : undefined,
    ...config,
  };

  const controller = new AbortController();

  if (storeState?.network.manualStatus !== 'online') {
    setTimeout(() => {
      controller.abort();
    }, 1);
  }

  const response = await fetch(fullUrl, {
    ...fetchConfig,
    signal: controller.signal,
  });

  if (!response.ok) {
    handleResponseError(response);
    throw new APIError(response.statusText);
  }

  const data = await response.json();
  return data as T;
};

const handleResponseError = async (response: Response) => {
  /**
   * 로그인 에러
   */
  if (response.status === 401) {
    const errorData = await response.json();
  }
};

export default request;
