import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export function useEventDataQuery(websiteId: string, eventId: string, options?: LaneDataOptions) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const params = useFilterParameters();

  return useLaneQuery({
    laneKey: [
      'websites:event-data',
      { websiteId, eventId, startAt, endAt, unit, timezone, ...params },
    ],
    loader: () =>
      get(`/websites/${websiteId}/event-data/${eventId}`, {
        startAt,
        endAt,
        unit,
        timezone,
        ...params,
      }),
    enabled: !!(websiteId && eventId),
    ...options,
  });
}
