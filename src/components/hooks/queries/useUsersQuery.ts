import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useUsersQuery() {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['users:admin', {}],
    loader: (pageParams: any, { signal }) => {
      return get(
        '/admin/users',
        {
          ...pageParams,
        },
        {},
        { signal },
      );
    },
  });
}
