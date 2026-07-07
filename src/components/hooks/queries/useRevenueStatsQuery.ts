import { useDateParameters } from '@/components/hooks/useDateParameters';
import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export interface RevenueStatsData {
  sum: number;
  count: number;
  average: number;
  unique_count: number;
  arpu: number;
  comparison: {
    sum: number;
    count: number;
    average: number;
    unique_count: number;
    arpu: number;
  };
}

export function useRevenueStatsQuery(
  {
    websiteId,
    currency,
    compare,
  }: {
    websiteId: string;
    currency: string;
    compare?: string;
  },
  options?: LaneDataOptions<RevenueStatsData>,
) {
  const { get } = useApi();
  const { startAt, endAt } = useDateParameters();
  const filters = useFilterParameters({ includePagination: false });

  return useLaneQuery<RevenueStatsData>({
    laneKey: [
      'websites:revenue:stats',
      { websiteId, currency, compare, startAt, endAt, ...filters },
    ],
    loader: ({ signal }) =>
      get(
        `/websites/${websiteId}/revenue/stats`,
        {
          currency,
          compare,
          startAt,
          endAt,
          ...filters,
        },
        {},
        { signal },
      ),
    enabled: !!(websiteId && currency),
    ...options,
  });
}
