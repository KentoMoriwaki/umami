import type { LaneDataOptions } from '@/lib/types';
import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useReportsQuery(
  { websiteId, type }: { websiteId: string; type?: string },
  options?: LaneDataOptions,
) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['reports', { websiteId, type }],
    loader: async () => get('/reports', { websiteId, type }),
    enabled: !!websiteId && !!type,
    ...options,
  });
}
