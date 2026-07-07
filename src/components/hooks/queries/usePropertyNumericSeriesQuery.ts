import { serializePropertyFilters } from '@/lib/params';
import type { LaneDataOptions, PropertyFilter } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';
import type { PropertyDataSource } from './usePropertyFieldsQuery';

export function usePropertyNumericSeriesQuery(
  source: PropertyDataSource,
  websiteId: string,
  propertyName: string,
  metric: 'sum' | 'avg' | 'count',
  propertyFilters: PropertyFilter[] = [],
  eventName?: string,
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const params = useFilterParameters({ includePagination: false });

  return useLaneQuery<any>({
    laneKey: [
      `websites:${source}-data:numeric-series`,
      {
        websiteId,
        propertyName,
        metric,
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
          ? `/websites/${websiteId}/event-data-pivot/numeric-series`
          : `/websites/${websiteId}/session-data/numeric-series`,
        {
          ...(source === 'event' ? { eventName } : {}),
          propertyName,
          metric,
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
