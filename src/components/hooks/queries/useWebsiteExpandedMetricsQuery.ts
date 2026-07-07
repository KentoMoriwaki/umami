import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export type WebsiteExpandedMetricsData = {
  name: string;
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
}[];

export function useWebsiteExpandedMetricsQuery(
  websiteId: string,
  params: { type: string; limit?: number; search?: string },
  options?: LaneDataOptions<WebsiteExpandedMetricsData>,
) {
  const { get } = useApi();
  const { startAt, endAt } = useDateParameters();
  const filters = useFilterParameters();

  return useLaneQuery<WebsiteExpandedMetricsData>({
    laneKey: [
      'websites:metrics:expanded',
      {
        websiteId,
        startAt,
        endAt,
        ...filters,
        ...params,
      },
    ],
    loader: async () =>
      get(`/websites/${websiteId}/metrics/expanded`, {
        startAt,
        endAt,
        ...filters,
        ...params,
      }),
    enabled: !!websiteId,
    ...options,
  });
}
