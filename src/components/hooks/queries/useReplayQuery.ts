import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

interface ReplayQueryOptions {
  until?: number;
  chunkIndex?: number;
  eventIndex?: number;
}

export function useReplayQuery(
  websiteId: string,
  replayId: string,
  options: ReplayQueryOptions = {},
) {
  const { get } = useApi();
  const { until, chunkIndex, eventIndex } = options;

  return useLaneQuery({
    laneKey: ['replay', { websiteId, replayId, until, chunkIndex, eventIndex }],
    loader: ({ signal }) => {
      return get(
        `/websites/${websiteId}/replays/${replayId}`,
        { until, chunkIndex, eventIndex },
        {},
        { signal },
      );
    },
    enabled: Boolean(websiteId && replayId),
  });
}
