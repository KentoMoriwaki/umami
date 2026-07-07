import { serializePropertyFilters } from '@/lib/params';
import type { EventDataSeriesPoint, LaneDataOptions, PropertyFilter } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';
import type { PropertyDataSource } from './usePropertyFieldsQuery';

export function usePropertyArraySeriesQuery(
  source: PropertyDataSource,
  websiteId: string,
  propertyName: string,
  propertyFilters: PropertyFilter[] = [],
  eventName?: string,
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const params = useFilterParameters({ includePagination: false });

  return useLaneQuery<EventDataSeriesPoint[]>({
    laneKey: [
      `websites:${source}-data:array-series`,
      {
        websiteId,
        propertyName,
        eventName,
        propertyFilters,
        startAt,
        endAt,
        unit,
        timezone,
        ...params,
      },
    ],
    loader: ({ signal }) =>
      get(
        source === 'event'
          ? `/websites/${websiteId}/event-data-pivot/array-series`
          : `/websites/${websiteId}/session-data/array-series`,
        {
          ...(source === 'event' ? { eventName } : {}),
          propertyName,
          startAt,
          endAt,
          unit,
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
