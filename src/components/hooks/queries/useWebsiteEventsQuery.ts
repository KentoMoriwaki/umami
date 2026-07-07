import { MAX_PAGING_RESULTS } from '@/lib/constants';
import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { usePagedQuery } from '../usePagedQuery';

const EVENT_TYPES = {
  views: 1,
  events: 2,
};

export function useWebsiteEventsQuery(
  websiteId: string,
  params?: Record<string, any>,
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return usePagedQuery({
    laneKey: [
      'websites:events',
      { websiteId, startAt, endAt, unit, timezone, ...filters, ...params },
    ],
    loader: (pageParams, { signal }) =>
      get(
        `/websites/${websiteId}/events`,
        {
          startAt,
          endAt,
          unit,
          timezone,
          ...filters,
          ...pageParams,
          eventType: EVENT_TYPES[params.view],
          maxResults: MAX_PAGING_RESULTS,
        },
        {},
        { signal },
      ),
    enabled: !!websiteId,
    ...options,
  });
}
