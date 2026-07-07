import { MAX_PAGING_RESULTS } from '@/lib/constants';
import { useApi } from '../useApi';
import { useDateParameters } from '../useDateParameters';
import { useFilterParameters } from '../useFilterParameters';
import { usePagedQuery } from '../usePagedQuery';

export function useRevenueSessionsQuery(
  websiteId: string,
  currency: string,
  params?: Record<string, string | number>,
) {
  const { get } = useApi();
  const { startAt, endAt, unit, timezone } = useDateParameters();
  const filters = useFilterParameters();

  return usePagedQuery({
    laneKey: [
      'revenue-sessions',
      { websiteId, currency, startAt, endAt, unit, timezone, ...params, ...filters },
    ],
    loader: pageParams => {
      return get(`/websites/${websiteId}/revenue/sessions`, {
        currency,
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
