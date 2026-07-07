import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export type WebsiteMetricsData = {
  x: string;
  y: number;
}[];

export function useWebsiteMetricsQuery(
  websiteId: string,
  params: { type: string; limit?: number; search?: string },
  options?: LaneDataOptions<WebsiteMetricsData>,
) {
  const { get } = useApi();
  const { startAt, endAt } = useDateParameters();
  const filters = useFilterParameters();

  return useLaneQuery<WebsiteMetricsData>({
    laneKey: [
      'websites:metrics',
      {
        websiteId,
        startAt,
        endAt,
        ...filters,
        ...params,
      },
    ],
    loader: async ({ signal }) =>
      get(
        `/websites/${websiteId}/metrics`,
        {
          startAt,
          endAt,
          ...filters,
          ...params,
        },
        {},
        { signal },
      ),
    enabled: !!websiteId,
    ...options,
  });
}
