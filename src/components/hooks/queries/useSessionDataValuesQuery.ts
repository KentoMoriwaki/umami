import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export function useSessionDataValuesQuery(
  websiteId: string,
  propertyName: string,
  options?: LaneDataOptions,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return useLaneQuery<any>({
    laneKey: [
      'websites:session-data:values',
      { websiteId, propertyName, startAt, endAt, unit, timezone, ...filters },
    ],
    loader: () =>
      get(`/websites/${websiteId}/session-data/values`, {
        startAt,
        endAt,
        unit,
        timezone,
        ...filters,
        propertyName,
      }),
    enabled: !!(websiteId && propertyName),
    ...options,
  });
}
