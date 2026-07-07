import { useFilterParameters } from '@/components/hooks/useFilterParameters';
import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useWebsiteSegmentsQuery(
  websiteId: string,
  params?: Record<string, string>,
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const filters = useFilterParameters();

  return useLaneQuery({
    laneKey: ['website:segments', { websiteId, ...filters, ...params }],
    loader: () => get(`/websites/${websiteId}/segments`, { ...filters, ...params }),
    enabled: !!websiteId,
    ...options,
  });
}
