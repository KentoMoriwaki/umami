import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useLinkSharesQuery({ linkId }: { linkId: string }, options?: LaneDataOptions) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['linkShares', { linkId }],
    loader: pageParams => {
      return get(`/links/${linkId}/shares`, pageParams);
    },
    ...options,
  });
}
