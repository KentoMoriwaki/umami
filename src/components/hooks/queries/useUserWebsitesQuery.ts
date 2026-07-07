import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useUserWebsitesQuery(
  { userId, teamId }: { userId?: string; teamId?: string },
  params?: Record<string, any>,
  options?: LaneDataOptions,
) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['websites', { userId, teamId, ...params }],
    loader: (pageParams, { signal }) => {
      return get(
        teamId
          ? `/teams/${teamId}/websites`
          : userId
            ? `/users/${userId}/websites`
            : '/me/websites',
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
