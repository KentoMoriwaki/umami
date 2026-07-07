import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export interface RevenueChartData {
  chart: { x: string; t: string; y: number; count: number }[];
}

export function useRevenueChartQuery(
  websiteId: string,
  currency: string,
  options?: LaneDataOptions<RevenueChartData>,
) {
  const { get } = useApi();
  const { startAt, endAt, timezone, unit } = useDateParameters();
  const filters = useFilterParameters({ includePagination: false });

  return useLaneQuery<RevenueChartData>({
    laneKey: [
      'websites:revenue:chart',
      {
        websiteId,
        currency,
        startAt,
        endAt,
        timezone,
        unit,
        ...filters,
      },
    ],
    loader: async ({ signal }) =>
      get(
        `/websites/${websiteId}/revenue/chart`,
        {
          currency,
          startAt,
          endAt,
          timezone,
          unit,
          ...filters,
        },
        {},
        { signal },
      ),
    enabled: !!(websiteId && currency),
    ...options,
  });
}
