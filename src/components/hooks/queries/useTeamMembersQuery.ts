import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useTeamMembersQuery(teamId: string) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['teams:members', { teamId }],
    loader: (params: any, { signal }) => {
      return get(`/teams/${teamId}/users`, params, {}, { signal });
    },
    enabled: !!teamId,
  });
}
