import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useWebsiteSegmentQuery(
  websiteId: string,
  segmentId: string,
  options?: LaneDataOptions,
) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['website:segments', { websiteId, segmentId }],
    loader: () => get(`/websites/${websiteId}/segments/${segmentId}`),
    enabled: !!(websiteId && segmentId),
    ...options,
  });
}
