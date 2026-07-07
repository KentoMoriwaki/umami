import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useLinkQuery(linkId?: string) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['link', { linkId }],
    loader: ({ signal }) => {
      return get(`/links/${linkId}`, {}, {}, { signal });
    },
    enabled: !!linkId,
  });
}
