import { REALTIME_INTERVAL } from '@/lib/constants';
import type { RealtimeData } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useRealtimeQuery(websiteId: string) {
  const { get } = useApi();
  return useLaneQuery<RealtimeData>({
    laneKey: ['realtime', { websiteId }],
    loader: async ({ signal }) => {
      return get(`/realtime/${websiteId}`, {}, {}, { signal });
    },
    enabled: !!websiteId,
    refetchInterval: REALTIME_INTERVAL,
  });
}
