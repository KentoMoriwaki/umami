import { useDateParameters } from '@/components/hooks/useDateParameters';
import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useFilterParameters } from '../useFilterParameters';
import { useLaneQuery } from '../useLaneQuery';

export function useResultQuery<T = any>(
  type: string,
  params?: Record<string, any>,
  options?: LaneDataOptions<T>,
) {
  const { websiteId, ...parameters } = params;
  const { post } = useApi();
  const { startDate, endDate, timezone, unit } = useDateParameters();
  const filters = useFilterParameters({ includePagination: false });

  return useLaneQuery<T>({
    laneKey: [
      'reports',
      {
        type,
        websiteId,
        startDate,
        endDate,
        timezone,
        unit,
        ...params,
        ...filters,
      },
    ],
    loader: ({ signal }) =>
      post(
        `/reports/${type}`,
        {
          websiteId,
          type,
          filters,
          parameters: {
            startDate,
            endDate,
            timezone,
            unit,
            ...parameters,
          },
        },
        {},
        { signal },
      ),
    enabled: !!type,
    ...options,
  });
}
