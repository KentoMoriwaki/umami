import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useWebsiteSessionQuery(websiteId: string, sessionId: string | undefined) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['session', { websiteId, sessionId }],
    loader: () => {
      return get(`/websites/${websiteId}/sessions/${sessionId}`);
    },
    enabled: Boolean(websiteId && sessionId),
  });
}
