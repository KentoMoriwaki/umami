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
  const pageParams = { page, search, orderBy, sortDescending };

  return useLaneQuery<PageResult<TData>, PageResult<TData>>({
    laneKey: [...laneKey, pageParams] as const,
    loader: ({ signal }) => Promise.resolve(loader(pageParams, { signal })),
    ...options,
  });
}
