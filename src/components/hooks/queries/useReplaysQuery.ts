import { MAX_PAGING_RESULTS } from '@/lib/constants';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { usePagedQuery } from '../usePagedQuery';

export function useReplaysQuery(websiteId: string, params?: Record<string, string | number>) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return usePagedQuery({
    laneKey: ['replays', { websiteId, startAt, endAt, unit, timezone, ...filters, ...params }],
    loader: pageParams => {
      return get(`/websites/${websiteId}/replays`, {
        startAt,
        endAt,
        unit,
        timezone,
        ...filters,
        ...pageParams,
        ...params,
        maxResults: MAX_PAGING_RESULTS,
      });
    },
  });
}
