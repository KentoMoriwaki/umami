import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export type PropertyDataSource = 'event' | 'session';

export function usePropertyFieldsQuery(
  source: PropertyDataSource,
  websiteId: string,
  eventName?: string,
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const params = useFilterParameters({ includePagination: false });

  return useLaneQuery<any>({
    laneKey: [
      `websites:${source}-data:fields`,
      { websiteId, eventName, startAt, endAt, unit, timezone, ...params },
    ],
    loader: ({ signal }) =>
      get(
        source === 'event'
          ? `/websites/${websiteId}/event-data/fields`
          : `/websites/${websiteId}/session-data/properties`,
        {
          ...(source === 'event' ? { event: eventName } : {}),
          startAt,
          endAt,
          unit,
          timezone,
          ...params,
        },
        {},
        { signal },
      ),
    enabled: !!(websiteId && (source === 'session' || eventName)),
    ...options,
  });
}
