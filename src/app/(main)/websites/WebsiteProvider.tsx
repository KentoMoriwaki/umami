'use client';
import { createContext, type ReactNode } from 'react';
import { useWebsiteQuery } from '@/components/hooks/queries/useWebsiteQuery';
import type { Website } from '@/generated/prisma/client';

export const WebsiteContext = createContext<Website>(null);

export function WebsiteProvider({
  websiteId,
  children,
}: {
  websiteId: string;
  children: ReactNode;
}) {
  const { data: website } = useWebsiteQuery(websiteId);

  if (!website) {
    return null;
  }

  return <WebsiteContext.Provider value={website}>{children}</WebsiteContext.Provider>;
}
