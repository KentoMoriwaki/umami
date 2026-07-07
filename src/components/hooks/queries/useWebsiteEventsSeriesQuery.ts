import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export function useWebsiteEventsSeriesQuery(
  websiteId: string,
  params?: { limit?: number },
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return useLaneQuery({
    laneKey: [
      'websites:events:series',
      { websiteId, startAt, endAt, unit, timezone, ...filters, ...params },
    ],
    loader: ({ signal }) =>
      get(
        `/websites/${websiteId}/events/series`,
        {
          startAt,
          endAt,
          unit,
          timezone,
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
