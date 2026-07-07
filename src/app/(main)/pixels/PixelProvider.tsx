'use client';
import { createContext, type ReactNode } from 'react';
import { usePixelQuery } from '@/components/hooks/queries/usePixelQuery';
import type { Pixel } from '@/generated/prisma/client';

export const PixelContext = createContext<Pixel>(null);

export function PixelProvider({ pixelId, children }: { pixelId?: string; children: ReactNode }) {
  const { data: pixel } = usePixelQuery(pixelId);

  if (!pixel) {
    return null;
  }

  return <PixelContext.Provider value={pixel}>{children}</PixelContext.Provider>;
}
