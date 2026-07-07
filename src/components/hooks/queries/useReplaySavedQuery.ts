import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useReplaySavedQuery(websiteId: string, replayId: string) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['replay:saved', { websiteId, replayId }],
    loader: ({ signal }) => {
      return get(`/websites/${websiteId}/replays/saved/${replayId}`, {}, {}, { signal });
    },
    enabled: Boolean(websiteId && replayId),
  });
}
