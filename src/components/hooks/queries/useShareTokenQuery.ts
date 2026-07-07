import { useEffect } from 'react';
import { setShareData, useApp } from '@/store/app';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function useShareTokenQuery(slug: string) {
  const { get } = useApi();
  const shareId = useApp(state => state.share?.shareId);
  const shareToken = useApp(state => state.shareToken?.token);
  const query = useLaneQuery<any | null>({
    laneKey: ['share', slug],
    loader: async () => {
      try {
        return await get(`/share/${slug}`);
      } catch {
        return null;
      }
    },
  });

  useEffect(() => {
    if (query.data?.token && (shareId !== query.data.shareId || shareToken !== query.data.token)) {
      setShareData(query.data, { token: query.data.token });
    }
  }, [query.data, shareId, shareToken]);

  return { ...query, share: query.data ?? undefined, data: query.data ?? undefined };
}
