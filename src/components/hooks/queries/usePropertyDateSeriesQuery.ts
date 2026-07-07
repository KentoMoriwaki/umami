import { serializePropertyFilters } from '@/lib/params';
import type { EventDataDateSeriesPoint, LaneDataOptions, PropertyFilter } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';
import type { PropertyDataSource } from './usePropertyFieldsQuery';

export function usePropertyDateSeriesQuery(
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

  return useLaneQuery<EventDataDateSeriesPoint[]>({
    laneKey: [
      `websites:${source}-data:date-series`,
      { websiteId, propertyName, eventName, propertyFilters, startAt, endAt, timezone, ...params },
    ],
    loader: ({ signal }) =>
      get(
        source === 'event'
          ? `/websites/${websiteId}/event-data-pivot/date-series`
          : `/websites/${websiteId}/session-data/date-series`,
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
