import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useActiveUsersQuery(websiteId: string, options?: LaneDataOptions) {
  const { get } = useApi();
  return useLaneQuery<any>({
    laneKey: ['websites:active', websiteId],
    loader: () => get(`/websites/${websiteId}/active`),
    enabled: !!websiteId,
    ...options,
  });
}
