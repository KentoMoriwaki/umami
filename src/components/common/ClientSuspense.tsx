'use client';

import { Loading } from '@umami/react-zen';
import { type ReactNode, Suspense } from 'react';

export function ClientSuspense({ children }: { children: ReactNode }) {
  return <Suspense fallback={<Loading placement="absolute" />}>{children}</Suspense>;
}
