import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useTeamWebsitesQuery(teamId: string) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['teams:websites', { teamId }],
    loader: (params: any, { signal }) => {
      return get(`/teams/${teamId}/websites`, params, {}, { signal });
    },
  });
}
