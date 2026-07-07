import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useUserQuery(userId: string, options?: LaneDataOptions) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['users', { userId }],
    loader: () => get(`/users/${userId}`),
    enabled: !!userId,
    ...options,
  });
}
