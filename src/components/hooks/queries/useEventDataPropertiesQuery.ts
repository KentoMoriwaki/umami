import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export function useEventDataPropertiesQuery(websiteId: string, options?: LaneDataOptions) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters({ includePagination: false });

  return useLaneQuery<any>({
    laneKey: [
      'websites:event-data:properties',
      { websiteId, startAt, endAt, unit, timezone, ...filters },
    ],
    loader: () =>
      get(`/websites/${websiteId}/event-data/properties`, {
        startAt,
        endAt,
        unit,
        timezone,
        ...filters,
      }),
    enabled: !!websiteId,
    ...options,
  });
}
