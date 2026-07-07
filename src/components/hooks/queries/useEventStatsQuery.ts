import { useDateParameters } from '@/components/hooks/useDateParameters';
import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export interface EventStatsData {
  events: number;
  visitors: number;
  visits: number;
  uniqueEvents: number;
  comparison: {
    events: number;
    visitors: number;
    visits: number;
    uniqueEvents: number;
  };
}

type EventStatsApiResponse = {
  data: EventStatsData;
};

export function useEventStatsQuery(
  { websiteId }: { websiteId: string },
  options?: LaneDataOptions<EventStatsApiResponse, EventStatsData>,
) {
  const { get } = useApi();
  const { startAt, endAt } = useDateParameters();
  const filters = useFilterParameters({ includePagination: false });

  return useLaneQuery<EventStatsApiResponse, EventStatsData>({
    laneKey: ['websites:events:stats', { websiteId, startAt, endAt, ...filters }],
    loader: ({ signal }) =>
      get(
        `/websites/${websiteId}/events/stats`,
        {
          startAt,
          endAt,
          ...filters,
        },
        {},
        { signal },
      ),
    select: response => response.data,
    enabled: !!websiteId,
    ...options,
  });
}
