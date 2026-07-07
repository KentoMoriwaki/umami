import { setUser, useApp } from '@/store/app';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

const selector = (state: { user: any }) => state.user;

export function useLoginQuery() {
  const { post } = useApi();
  const user = useApp(selector);

  const query = useLaneQuery<{ user?: any; error?: unknown }>({
    laneKey: ['login'],
    loader: async ({ signal }) => {
      try {
        const data = await post('/auth/verify', {}, {}, { signal });

        setUser(data);

        return { user: data };
      } catch (error) {
        return { error };
      }
    },
    enabled: !user,
  });

  return {
    ...query,
    data: query.data?.user,
    error: query.data?.error,
    user: user ?? query.data?.user,
    setUser,
  };
}
