import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useWebsiteSessionQuery(websiteId: string, sessionId: string | undefined) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['session', { websiteId, sessionId }],
    loader: ({ signal }) => {
      return get(`/websites/${websiteId}/sessions/${sessionId}`, {}, {}, { signal });
    },
    enabled: Boolean(websiteId && sessionId),
  });
}
