import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';

export function usePixelQuery(pixelId?: string) {
  const { get } = useApi();

  return useLaneQuery({
    laneKey: ['pixel', { pixelId }],
    loader: () => {
      return get(`/pixels/${pixelId}`);
    },
    enabled: !!pixelId,
  });
}
