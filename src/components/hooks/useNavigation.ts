import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useDeferredValue, useEffect, useMemo, useState, useTransition } from 'react';
import { buildPath } from '@/lib/url';

export function useNavigation() {
  const nextRouter = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, startNavigationTransition] = useTransition();
  const searchParamsKey = searchParams.toString();
  const [, teamId] = pathname.match(/\/teams\/([a-f0-9-]+)/) || [];
  const [, websiteId] = pathname.match(/\/websites\/([a-f0-9-]+)/) || [];
  const [, linkId] = pathname.match(/\/links\/([a-f0-9-]+)/) || [];
  const [, pixelId] = pathname.match(/\/pixels\/([a-f0-9-]+)/) || [];
  const [, boardId] = pathname.match(/\/boards\/([a-f0-9-]+)/) || [];
  const nextQueryParams = useMemo(() => Object.fromEntries(searchParams), [searchParamsKey]);
  const [queryParams, setQueryParams] = useState(nextQueryParams);
  const deferredQueryParams = useDeferredValue(queryParams);
  const isQueryStale = deferredQueryParams !== queryParams;

  const updateParams = useCallback(
    (params?: Record<string, string | number>) => {
      return buildPath(pathname, { ...queryParams, ...params });
    },
    [pathname, queryParams],
  );

  const replaceParams = useCallback(
    (params?: Record<string, string | number>) => {
      return buildPath(pathname, params);
    },
    [pathname],
  );

  const renderUrl = useCallback(
    (path: string, params?: Record<string, string | number> | false) => {
      return buildPath(
        teamId ? `/teams/${teamId}${path}` : path,
        params === false ? {} : { ...queryParams, ...params },
      );
    },
    [teamId, queryParams],
  );

  useEffect(() => {
    startNavigationTransition(() => {
      setQueryParams(nextQueryParams);
    });
  }, [nextQueryParams, startNavigationTransition]);

  const router = useMemo(
    () => ({
      ...nextRouter,
      push: (...args: Parameters<typeof nextRouter.push>) => {
        startNavigationTransition(() => {
          nextRouter.push(...args);
        });
      },
      replace: (...args: Parameters<typeof nextRouter.replace>) => {
        startNavigationTransition(() => {
          nextRouter.replace(...args);
        });
      },
    }),
    [nextRouter, startNavigationTransition],
  );

  return {
    router,
    pathname,
    searchParams,
    query: queryParams,
    deferredQuery: deferredQueryParams,
    isQueryStale,
    teamId,
    websiteId,
    linkId,
    pixelId,
    boardId,
    updateParams,
    replaceParams,
    renderUrl,
  };
}
