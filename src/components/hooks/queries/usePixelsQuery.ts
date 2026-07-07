import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function usePixelsQuery(
  { teamId }: { teamId?: string },
  params?: Record<string, any>,
  options?: LaneDataOptions,
) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['pixels', { teamId, ...params }],
    loader: (pageParams, { signal }) => {
      return get(
        teamId ? `/teams/${teamId}/pixels` : '/pixels',
        {
          ...pageParams,
          ...params,
        },
        {},
        { signal },
      );
    },
    ...options,
  });
}
