import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

type DateRange = {
  startDate?: string;
  endDate?: string;
};

export function useDateRangeQuery(websiteId: string, options?: LaneDataOptions) {
  const { get } = useApi();

  const { data } = useLaneQuery<DateRange>({
    laneKey: ['date-range', websiteId],
    loader: () => get(`/websites/${websiteId}/daterange`),
    enabled: !!websiteId,
    ...options,
  });

  return {
    startDate: data?.startDate ? new Date(data.startDate) : null,
    endDate: data?.endDate ? new Date(data.endDate) : null,
  };
}
