import { useCallback } from 'react';
import { useLaneInstance } from 'use-lane';
import { create } from 'zustand';
import { invalidateModifiedKey } from '@/lib/lane-keys';

const store = create(() => ({}));

export function touch(key: string) {
  store.setState({ [key]: Date.now() });
}

export function useModified(key?: string) {
  const modified = store(state => state?.[key]);
  const lane = useLaneInstance();
  const invalidate = useCallback(
    (nextKey: string) => {
      touch(nextKey);
      invalidateModifiedKey(lane, nextKey);
    },
    [lane],
  );

  return { modified, touch: invalidate };
}
