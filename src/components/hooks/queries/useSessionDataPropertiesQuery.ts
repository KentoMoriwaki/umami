import { serializePropertyFilters } from '@/lib/params';
import type { LaneDataOptions, PropertyFilter } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export function useSessionDataPropertiesQuery(
  websiteId: string,
  params?: {
    propertyName?: string;
    propertyFilters?: PropertyFilter[];
  },
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters({ includePagination: false });
  const { propertyName, propertyFilters = [] } = params || {};

  return useLaneQuery<any>({
    laneKey: [
      'websites:session-data:properties',
      {
        websiteId,
        propertyName,
        propertyFilters,
        startAt,
        endAt,
        unit,
        timezone,
        ...filters,
      },
    ],
    loader: ({ signal }) =>
      get(
        `/websites/${websiteId}/session-data/properties`,
        {
          startAt,
          endAt,
          unit,
          timezone,
          propertyName,
          ...serializePropertyFilters(propertyFilters),
          ...filters,
        },
        {},
        { signal },
      ),
    enabled: !!websiteId,
    ...options,
  });
}
