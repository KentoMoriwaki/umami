import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export type RevenueMetricType = 'country' | 'region' | 'referrer' | 'channel';

export type RevenueMetricsData = {
  name: string;
  value: number;
  country?: string;
}[];

export function useRevenueMetricsQuery(
  websiteId: string,
  params: { type: RevenueMetricType; currency: string },
  options?: LaneDataOptions<RevenueMetricsData>,
) {
  const { get } = useApi();
  const { startAt, endAt } = useDateParameters();
  const filters = useFilterParameters({ includePagination: false });

  return useLaneQuery<RevenueMetricsData>({
    laneKey: [
      'websites:revenue:metrics',
      {
        websiteId,
        startAt,
        endAt,
        ...filters,
        ...params,
      },
    ],
    loader: async () =>
      get(`/websites/${websiteId}/revenue/metrics`, {
        startAt,
        endAt,
        ...filters,
        ...params,
      }),
    enabled: !!(websiteId && params.currency && params.type),
    ...options,
  });
}
