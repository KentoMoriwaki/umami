import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useWebsitesQuery(params?: Record<string, any>, options?: LaneDataOptions) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['websites:admin', { ...params }],
    loader: (pageParams, { signal }) => {
      return get(
        `/admin/websites`,
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
