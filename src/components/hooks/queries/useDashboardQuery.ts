import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useDashboardQuery(options?: LaneDataOptions) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['dashboard', {}],
    loader: () => get('/dashboard'),
    ...options,
  });
}
