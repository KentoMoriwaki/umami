import { useDateParameters } from '@/components/hooks/useDateParameters';
import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export interface WebsiteStatsData {
  pageviews: number;
  visitors: number;
  visits: number;
  bounces: number;
  totaltime: number;
  comparison: {
    pageviews: number;
    visitors: number;
    visits: number;
    bounces: number;
    totaltime: number;
  };
}

export function useWebsiteStatsQuery(
  { websiteId, compare }: { websiteId: string; compare?: string },
  options?: LaneDataOptions<WebsiteStatsData>,
) {
  const { get } = useApi();
  const { startAt, endAt } = useDateParameters();
  const filters = useFilterParameters();

  return useLaneQuery<WebsiteStatsData>({
    laneKey: ['websites:stats', { websiteId, compare, startAt, endAt, ...filters }],
    loader: ({ signal }) =>
      get(`/websites/${websiteId}/stats`, { compare, startAt, endAt, ...filters }, {}, { signal }),
    enabled: !!websiteId,
    ...options,
  });
}
