import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useUserTeamsQuery(userId: string) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['teams', { userId }],
    loader: (params, { signal }) => {
      return get(`/users/${userId}/teams`, params, {}, { signal });
    },
    enabled: !!userId,
  });
}
