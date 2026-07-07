import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useTeamQuery(teamId: string, options?: LaneDataOptions) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['teams', { teamId }],
    loader: () => get(`/teams/${teamId}`),
    enabled: !!teamId,
    ...options,
  });
}
