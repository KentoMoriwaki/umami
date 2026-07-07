import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useTeamsQuery(params?: Record<string, any>, options?: LaneDataOptions) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['teams:admin', { ...params }],
    loader: pageParams => {
      return get(`/admin/teams`, {
        ...pageParams,
        ...params,
      });
    },
    ...options,
  });
}
