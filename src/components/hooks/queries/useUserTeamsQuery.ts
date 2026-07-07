import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useUserTeamsQuery(userId: string) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['teams', { userId }],
    loader: params => {
      return get(`/users/${userId}/teams`, params);
    },
    enabled: !!userId,
  });
}
