import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useSessionDataQuery(websiteId: string, sessionId: string) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['session:data', { websiteId, sessionId }],
    loader: () => {
      return get(`/websites/${websiteId}/sessions/${sessionId}/properties`, { websiteId });
    },
  });
}
