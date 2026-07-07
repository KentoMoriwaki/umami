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
    loader: () => get(`/websites/${websiteId}/segments/${cohortId}`),
    enabled: !!(websiteId && cohortId),
    ...options,
  });
}
