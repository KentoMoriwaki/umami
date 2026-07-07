import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useSessionActivityQuery(
  websiteId: string,
  sessionId: string,
  startDate: Date,
  endDate: Date,
) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['session:activity', { websiteId, sessionId, startDate, endDate }],
    loader: ({ signal }) => {
      return get(
        `/websites/${websiteId}/sessions/${sessionId}/activity`,
        {
          startAt: +new Date(startDate),
          endAt: +new Date(endDate),
        },
        {},
        { signal },
      );
    },
    enabled: Boolean(websiteId && sessionId && startDate && endDate),
  });
}
