import { buildPath } from '@/lib/url';

export interface ErrorResponse {
  error: {
    status: number;
    message: string;
    code?: string;
  };
}

export interface FetchResponse {
  ok: boolean;
  status: number;
  data?: any;
  error?: ErrorResponse;
}

export interface RequestOptions {
  signal?: AbortSignal;
}

export async function request(
  method: string,
  url: string,
  body?: string,
  headers: object = {},
  options: RequestOptions = {},
): Promise<FetchResponse> {
  return fetch(url, {
    method,
    cache: 'no-cache',
    signal: options.signal,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...headers,
    },
    body,
  }).then(async res => {
    const data = await res.json();

    return {
      ok: res.ok,
      status: res.status,
      data,
    };
  });
}

export async function httpGet(
  path: string,
  params: object = {},
  headers: object = {},
  options: RequestOptions = {},
) {
  return request('GET', buildPath(path, params), undefined, headers, options);
}

export async function httpDelete(
  path: string,
  params: object = {},
  headers: object = {},
  options: RequestOptions = {},
) {
  return request('DELETE', buildPath(path, params), undefined, headers, options);
}

export async function httpPost(
  path: string,
  params: object = {},
  headers: object = {},
  options: RequestOptions = {},
) {
  return request('POST', path, JSON.stringify(params), headers, options);
}

export async function httpPut(
  path: string,
  params: object = {},
  headers: object = {},
  options: RequestOptions = {},
) {
  return request('PUT', path, JSON.stringify(params), headers, options);
}
