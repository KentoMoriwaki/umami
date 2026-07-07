import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useWebsiteCohortQuery(
  websiteId: string,
  cohortId: string,
  options?: LaneDataOptions,
) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['website:cohorts', { websiteId, cohortId }],
    loader: ({ signal }) => get(`/websites/${websiteId}/segments/${cohortId}`, {}, {}, { signal }),
    enabled: !!(websiteId && cohortId),
    ...options,
  });
}
