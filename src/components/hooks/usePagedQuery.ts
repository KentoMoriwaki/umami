import { useDeferredValue, useMemo } from 'react';
import type { LaneDataOptions, PageResult } from '@/lib/types';
import { type LaneQueryResult, useLaneQuery } from './useLaneQuery';
import { useNavigation } from './useNavigation';

export function usePagedQuery<TData = any>({
  laneKey,
  loader,
  ...options
}: LaneDataOptions<PageResult<TData>> & {
  laneKey: readonly unknown[];
  loader: (
    params: object,
    context: { signal: AbortSignal },
  ) => Promise<PageResult<TData>> | PageResult<TData>;
}): LaneQueryResult<PageResult<TData>> {
  const {
    query: { page, search, orderBy, sortDescending },
  } = useNavigation();
  const pageParams = useMemo(
    () => ({ page, search, orderBy, sortDescending }),
    [orderBy, page, search, sortDescending],
  );
  const deferredPageParams = useDeferredValue(pageParams);
  const isStale = deferredPageParams !== pageParams;

  const query = useLaneQuery<PageResult<TData>, PageResult<TData>>({
    laneKey: [...laneKey, deferredPageParams] as const,
    loader: ({ signal }) => Promise.resolve(loader(deferredPageParams, { signal })),
    ...options,
  });

  return { ...query, isStale: query.isStale || isStale };
}
