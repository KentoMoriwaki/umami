import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useBoardsQuery(
  { teamId }: { teamId?: string },
  params?: Record<string, any>,
  options?: LaneDataOptions,
) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['boards', { teamId, ...params }],
    loader: pageParams => {
      return get(teamId ? `/teams/${teamId}/boards` : '/boards', {
        ...pageParams,
        ...params,
      });
    },
    ...options,
  });
}
