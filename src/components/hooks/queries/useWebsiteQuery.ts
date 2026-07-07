import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useWebsiteQuery(websiteId?: string, options?: LaneDataOptions) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['website', { websiteId }],
    loader: () => get(`/websites/${websiteId}`),
    enabled: !!websiteId,
    ...options,
  });
}
