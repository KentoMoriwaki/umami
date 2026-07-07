import { serializePropertyFilters } from '@/lib/params';
import type { LaneDataOptions, PropertyFilter } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export function useSessionDataActivityStatsQuery(
  websiteId: string,
  propertyName: string,
  propertyFilters: PropertyFilter[] = [],
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const params = useFilterParameters({ includePagination: false });

  return useLaneQuery({
    laneKey: [
      'websites:session-data:activity-stats',
      { websiteId, propertyName, propertyFilters, startAt, endAt, unit, timezone, ...params },
    ],
    loader: ({ signal }) =>
      get(
        `/websites/${websiteId}/session-data/stats`,
        {
          startAt,
          endAt,
          unit,
          timezone,
          propertyName,
          ...serializePropertyFilters(propertyFilters),
          ...params,
        },
        {},
        { signal },
      ),
    enabled: !!(websiteId && propertyName),
    ...options,
  });
}
