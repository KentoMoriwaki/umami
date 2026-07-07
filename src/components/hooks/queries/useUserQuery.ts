import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useUserQuery(userId: string, options?: LaneDataOptions) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['users', { userId }],
    loader: ({ signal }) => get(`/users/${userId}`, {}, {}, { signal }),
    enabled: !!userId,
    ...options,
  });
}
