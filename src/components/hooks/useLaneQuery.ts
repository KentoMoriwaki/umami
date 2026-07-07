import { use, useEffect } from 'react';
import {
  type LaneLoader,
  type LaneRead,
  type LaneUseOptions,
  useLane,
  useLaneInstance,
} from 'use-lane';

export type LaneQueryOptions<TData = any, TSelected = TData> = LaneUseOptions & {
  enabled?: boolean;
  refetchInterval?: number;
  select?: (data: TData) => TSelected;
};

export type LaneQueryResult<TData, TSelected = TData> = {
  data: TSelected | undefined;
  refreshError: unknown;
  isFetching: boolean;
  isStale: boolean;
  isPending: boolean;
  isBackgroundPending: boolean;
  isTransitionPending: boolean;
  invalidate: () => void;
  promise: Promise<LaneRead<TData>> | undefined;
};

export function useLaneQuery<TData = any, TSelected = TData>({
  laneKey,
  loader,
  enabled = true,
  refetchInterval,
  select,
  ...options
}: LaneQueryOptions<TData, TSelected> & {
  laneKey: readonly unknown[];
  loader: LaneLoader<TData>;
}): LaneQueryResult<TData, TSelected> {
  const lane = useLaneInstance();
  const result = useLane<TData>(laneKey, enabled ? loader : undefined, options);
  const read = result.promise ? use(result.promise) : undefined;
  const data = read
    ? select
      ? select(read.data)
      : (read.data as unknown as TSelected)
    : undefined;
  const isPending = result.isBackgroundPending || result.isTransitionPending;

  useEffect(() => {
    if (!enabled || !refetchInterval) {
      return;
    }

    const timer = setInterval(() => {
      lane.invalidate(laneKey, { background: true, onlyIf: 'settled' });
    }, refetchInterval);

    return () => clearInterval(timer);
  }, [enabled, lane, laneKey, refetchInterval]);

  return {
    data,
    refreshError: read?.refreshError,
    isFetching: isPending,
    isStale: false,
    isPending,
    isBackgroundPending: result.isBackgroundPending,
    isTransitionPending: result.isTransitionPending,
    invalidate: result.invalidate,
    promise: result.promise,
  };
}
