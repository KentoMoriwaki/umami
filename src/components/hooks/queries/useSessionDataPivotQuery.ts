import { MAX_PAGING_RESULTS } from '@/lib/constants';
import { serializePropertyFilters } from '@/lib/params';
import type { LaneDataOptions, PropertyFilter } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export function useSessionDataPivotQuery(
  websiteId: string,
  propertyName: string,
  propertyFilters: PropertyFilter[] = [],
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const params = useFilterParameters();

  return useLaneQuery({
    laneKey: [
      'websites:session-data-pivot',
      { websiteId, propertyName, propertyFilters, startAt, endAt, unit, timezone, ...params },
    ],
    loader: () =>
      get(`/websites/${websiteId}/session-data-pivot`, {
        startAt,
        endAt,
        unit,
        timezone,
        propertyName,
        ...serializePropertyFilters(propertyFilters),
        ...params,
        maxResults: MAX_PAGING_RESULTS,
      }),
    enabled: !!(websiteId && propertyName),
    ...options,
  });
}
