import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useLinksQuery(
  { teamId }: { teamId?: string },
  params?: Record<string, any>,
  options?: LaneDataOptions,
) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['links', { teamId, ...params }],
    loader: pageParams => {
      return get(teamId ? `/teams/${teamId}/links` : '/links', {
        ...pageParams,
        ...params,
      });
    },
    ...options,
  });
}
