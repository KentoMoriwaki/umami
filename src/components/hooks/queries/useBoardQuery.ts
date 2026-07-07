import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useBoardQuery(boardId: string, options?: LaneDataOptions) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['boards', { boardId }],
    loader: ({ signal }) => get(`/boards/${boardId}`, {}, {}, { signal }),
    enabled: !!boardId && boardId !== 'create',
    ...options,
  });
}
