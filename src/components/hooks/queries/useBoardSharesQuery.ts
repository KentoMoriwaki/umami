import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useBoardSharesQuery({ boardId }: { boardId: string }, options?: LaneDataOptions) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['boardShares', { boardId }],
    loader: (pageParams, { signal }) => {
      return get(`/boards/${boardId}/shares`, pageParams, {}, { signal });
    },
    ...options,
  });
}
