import { useFilterParameters } from '@/components/hooks/useFilterParameters';
import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useWebsiteCohortsQuery(
  websiteId: string,
  params?: Record<string, string>,
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const filters = useFilterParameters();

  return useLaneQuery({
    laneKey: ['website:cohorts', { websiteId, ...filters, ...params }],
    loader: ({ signal }) => {
      return get(`/websites/${websiteId}/segments`, { ...filters, ...params }, {}, { signal });
    },
    enabled: !!websiteId,
    ...options,
  });
}
