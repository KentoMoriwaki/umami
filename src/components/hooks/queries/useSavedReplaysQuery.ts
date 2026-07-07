import { useApi } from '../useApi';
import { usePagedQuery } from '../usePagedQuery';

export function useSavedReplaysQuery(websiteId: string) {
  const { get } = useApi();

  return usePagedQuery({
    laneKey: ['replays:saved', { websiteId }],
    loader: (pageParams, { signal }) => {
      return get(
        `/websites/${websiteId}/replays/saved`,
        {
          ...pageParams,
        },
        {},
        { signal },
      );
    },
  });
}
