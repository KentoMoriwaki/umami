import { useCallback } from 'react';
import { useLaneInstance } from 'use-lane';
import { invalidateModifiedKey } from '@/lib/lane-keys';

export function useModified() {
  const lane = useLaneInstance();
  const touch = useCallback(
    (nextKey: string) => {
      invalidateModifiedKey(lane, nextKey);
    },
    [lane],
  );

  return { touch };
}
