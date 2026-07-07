import { useCallback } from 'react';
import { getApiUrl } from '@/lib/api-url';
import { getClientAuthToken } from '@/lib/client';
import { SHARE_CONTEXT_HEADER, SHARE_TOKEN_HEADER } from '@/lib/constants';
import {
  type FetchResponse,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
  type RequestOptions,
} from '@/lib/fetch';
import { useApp } from '@/store/app';

let activeRequestSignal: AbortSignal | undefined;

export async function withRequestSignal<T>(signal: AbortSignal, callback: () => Promise<T> | T) {
  const previousSignal = activeRequestSignal;
  activeRequestSignal = signal;

  try {
    return await callback();
  } finally {
    activeRequestSignal = previousSignal;
  }
}

function getRequestOptions(options: RequestOptions = {}) {
  return { ...options, signal: options.signal ?? activeRequestSignal };
}

async function handleResponse(res: FetchResponse): Promise<any> {
  if (!res.ok) {
    const { message, code, status } = res?.data?.error || {};

    return Promise.reject(Object.assign(new Error(message), { code, status }));
  }
  return Promise.resolve(res.data);
}

export function useApi() {
  const shareId = useApp(state => state.share?.shareId);
  const shareToken = useApp(state => state.shareToken?.token);

  const shareHeaders =
    shareId && shareToken ? { [SHARE_TOKEN_HEADER]: shareToken, [SHARE_CONTEXT_HEADER]: '1' } : {};

  const defaultHeaders = {
    authorization: `Bearer ${getClientAuthToken()}`,
    ...shareHeaders,
  };
  const getUrl = (url: string) => {
    return getApiUrl(url);
  };

  const getHeaders = (headers: any = {}) => {
    return { ...defaultHeaders, ...headers };
  };

  return {
    get: useCallback(
      async (
        url: string,
        params: object = {},
        headers: object = {},
        options: RequestOptions = {},
      ) => {
        return httpGet(getUrl(url), params, getHeaders(headers), getRequestOptions(options)).then(
          handleResponse,
        );
      },
      [httpGet],
    ),

    post: useCallback(
      async (
        url: string,
        params: object = {},
        headers: object = {},
        options: RequestOptions = {},
      ) => {
        return httpPost(getUrl(url), params, getHeaders(headers), getRequestOptions(options)).then(
          handleResponse,
        );
      },
      [httpPost],
    ),

    put: useCallback(
      async (
        url: string,
        params: object = {},
        headers: object = {},
        options: RequestOptions = {},
      ) => {
        return httpPut(getUrl(url), params, getHeaders(headers), getRequestOptions(options)).then(
          handleResponse,
        );
      },
      [httpPut],
    ),

    del: useCallback(
      async (
        url: string,
        params: object = {},
        headers: object = {},
        options: RequestOptions = {},
      ) => {
        return httpDelete(
          getUrl(url),
          params,
          getHeaders(headers),
          getRequestOptions(options),
        ).then(handleResponse);
      },
      [httpDelete],
    ),
  };
}
