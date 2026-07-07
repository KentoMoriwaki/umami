import { MAX_PAGING_RESULTS } from '@/lib/constants';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { usePagedQuery } from '../usePagedQuery';

export function useWebsiteSessionsQuery(
  websiteId: string,
  params?: Record<string, string | number>,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return usePagedQuery({
    laneKey: ['sessions', { websiteId, startAt, endAt, unit, timezone, ...params, ...filters }],
    loader: (pageParams, { signal }) => {
      return get(
        `/websites/${websiteId}/sessions`,
        {
          startAt,
          endAt,
          unit,
          timezone,
          ...filters,
          ...pageParams,
          ...params,
          maxResults: MAX_PAGING_RESULTS,
        },
        {},
        { signal },
      );
    },
  });
}
