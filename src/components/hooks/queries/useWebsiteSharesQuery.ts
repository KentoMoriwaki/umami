import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useWebsiteSharesQuery(
  { websiteId }: { websiteId: string },
  options?: LaneDataOptions,
) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['websiteShares', { websiteId }],
    loader: pageParams => {
      return get(`/websites/${websiteId}/shares`, pageParams);
    },
    ...options,
  });
}
