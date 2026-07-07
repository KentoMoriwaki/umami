import { useCallback, useState } from 'react';
import type { ApiError } from '@/lib/types';
import { useApi } from '../useApi';
import { useModified } from '../useModified';

type MutationCallbacks<TData, TVariables> = {
  onSuccess?: (data: TData, variables: TVariables) => void | Promise<void>;
  onError?: (error: ApiError, variables: TVariables) => void | Promise<void>;
};

export function useDeleteQuery(path: string, params?: Record<string, any>) {
  const { del } = useApi();
  const { touch } = useModified();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<ApiError | null>(null);

  const mutateAsync = useCallback(
    async (
      data: Record<string, any> | null = null,
      callbacks: MutationCallbacks<any, Record<string, any> | null> = {},
    ) => {
      setIsPending(true);
      setError(null);

      try {
        const result = await del(path, params);
        await callbacks.onSuccess?.(result, data);
        return result;
      } catch (e) {
        const apiError = e as ApiError;
        setError(apiError);
        await callbacks.onError?.(apiError, data);
        throw apiError;
      } finally {
        setIsPending(false);
      }
    },
    [del, params, path],
  );

  const mutate = useCallback(
    (
      data: Record<string, any> | null = null,
      callbacks: MutationCallbacks<any, Record<string, any> | null> = {},
    ) => {
      void mutateAsync(data, callbacks).catch(() => undefined);
    },
    [mutateAsync],
  );

  return { mutate, mutateAsync, isPending, error, touch };
}
