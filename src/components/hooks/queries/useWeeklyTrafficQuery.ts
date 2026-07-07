import { useFilterParameters } from '@/components/hooks/useFilterParameters';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useLaneQuery } from '../useLaneQuery';

export function useWeeklyTrafficQuery(websiteId: string, params?: Record<string, string | number>) {
  const { get } = useApi();
  const { startAt, endAt, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return useLaneQuery({
    laneKey: ['sessions', { websiteId, startAt, endAt, timezone, ...params, ...filters }],
    loader: ({ signal }) => {
      return get(
        `/websites/${websiteId}/sessions/weekly`,
        {
          startAt,
          endAt,
          timezone,
          ...params,
          ...filters,
        },
        {},
        { signal },
      );
    },
  });
}
