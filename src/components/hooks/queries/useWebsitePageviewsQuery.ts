import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export interface WebsitePageviewsData {
  pageviews: { x: string; y: number }[];
  sessions: { x: string; y: number }[];
}

export function useWebsitePageviewsQuery(
  { websiteId, compare }: { websiteId: string; compare?: string },
  options?: LaneDataOptions<WebsitePageviewsData>,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const queryParams = useFilterParameters();

  return useLaneQuery<WebsitePageviewsData>({
    laneKey: [
      'websites:pageviews',
      { websiteId, compare, startAt, endAt, unit, timezone, ...queryParams },
    ],
    loader: ({ signal }) =>
      get(
        `/websites/${websiteId}/pageviews`,
        {
          compare,
          startAt,
          endAt,
          unit,
          timezone,
          ...queryParams,
        },
        {},
        { signal },
      ),
    enabled: !!websiteId,
    ...options,
  });
}
