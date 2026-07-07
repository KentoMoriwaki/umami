import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useReportQuery(reportId: string) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['report', { reportId }],
    loader: ({ signal }) => {
      return get(`/reports/${reportId}`, {}, {}, { signal });
    },
    enabled: !!reportId,
  });
}
