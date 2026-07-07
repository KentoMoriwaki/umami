import { useMemo } from 'react';
import { FILTER_COLUMNS } from '@/lib/constants';
import { useShare } from './context/useShare';
import { useNavigation } from './useNavigation';

export function useFilterParameters({
  includePagination = true,
  deferred = true,
}: {
  includePagination?: boolean;
  deferred?: boolean;
} = {}) {
  const { query, deferredQuery } = useNavigation();
  const queryParams = deferred ? deferredQuery : query;
  const share = useShare();
  const allowFilter = share?.parameters?.allowFilter !== false;

  return useMemo(() => {
    const filterParams: Record<string, any> = {};

    if (allowFilter) {
      for (const key of Object.keys(queryParams)) {
        const baseName = key.replace(/\d+$/, '');
        if (FILTER_COLUMNS[baseName]) {
          filterParams[key] = queryParams[key];
        }
      }
    }

    const params = {
      ...filterParams,
      search: queryParams.search,
      segment: allowFilter ? queryParams.segment : undefined,
      cohort: allowFilter ? queryParams.cohort : undefined,
      excludeBounce: allowFilter ? queryParams.excludeBounce : undefined,
      match: allowFilter ? queryParams.match : undefined,
    } as Record<string, any>;

    if (includePagination) {
      params.page = queryParams.page;
      params.pageSize = queryParams.pageSize;
    }

    return params;
  }, [allowFilter, includePagination, queryParams]);
}
