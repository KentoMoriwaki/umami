import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export function useWebsiteSessionStatsQuery(websiteId: string, options?: Record<string, string>) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return useLaneQuery({
    laneKey: ['sessions:stats', { websiteId, startAt, endAt, unit, timezone, ...filters }],
    loader: ({ signal }) =>
      get(
        `/websites/${websiteId}/sessions/stats`,
        { startAt, endAt, unit, timezone, ...filters },
        {},
        { signal },
      ),
    enabled: !!websiteId,
    ...options,
  });
}
