import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function usePixelSharesQuery({ pixelId }: { pixelId: string }, options?: LaneDataOptions) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['pixelShares', { pixelId }],
    loader: pageParams => {
      return get(`/pixels/${pixelId}/shares`, pageParams);
    },
    ...options,
  });
}
