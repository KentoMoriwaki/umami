import { serializePropertyFilters } from '@/lib/params';
import type { LaneDataOptions, PropertyFilter } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';
import type { PropertyDataSource } from './usePropertyFieldsQuery';

export function usePropertyValuesQuery(
  source: PropertyDataSource,
  websiteId: string,
  propertyName: string,
  dataType?: number,
  propertyFilters: PropertyFilter[] = [],
  eventName?: string,
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const params = useFilterParameters({ includePagination: false });

  return useLaneQuery<any>({
    laneKey: [
      `websites:${source}-data:values`,
      {
        websiteId,
        propertyName,
        dataType,
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
          ? `/websites/${websiteId}/event-data/values`
          : `/websites/${websiteId}/session-data/values`,
        {
          ...(source === 'event' ? { event: eventName } : {}),
          startAt,
          endAt,
          unit,
          timezone,
          propertyName,
          dataType,
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
