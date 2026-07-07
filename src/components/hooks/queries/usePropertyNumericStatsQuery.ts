import { serializePropertyFilters } from '@/lib/params';
import type { EventDataNumericStats, LaneDataOptions, PropertyFilter } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';
import type { PropertyDataSource } from './usePropertyFieldsQuery';

export function usePropertyNumericStatsQuery(
  source: PropertyDataSource,
  websiteId: string,
  propertyName: string,
  propertyFilters: PropertyFilter[] = [],
  eventName?: string,
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, timezone } = useDateParameters();
  const params = useFilterParameters({ includePagination: false });

  return useLaneQuery<EventDataNumericStats>({
    laneKey: [
      `websites:${source}-data:numeric-stats`,
      { websiteId, propertyName, eventName, propertyFilters, startAt, endAt, timezone, ...params },
    ],
    loader: ({ signal }) =>
      get(
        source === 'event'
          ? `/websites/${websiteId}/event-data-pivot/numeric-stats`
          : `/websites/${websiteId}/session-data/numeric-stats`,
        {
          ...(source === 'event' ? { eventName } : {}),
          propertyName,
          startAt,
          endAt,
          timezone,
          ...serializePropertyFilters(propertyFilters),
          ...params,
        },
        {},
        { signal },
      ),
    enabled: !!(websiteId && propertyName && (source === 'session' || eventName)),
    ...options,
  });
}
