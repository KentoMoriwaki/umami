'use client';
import { createContext, type ReactNode } from 'react';
import { useLinkQuery } from '@/components/hooks/queries/useLinkQuery';
import type { Link } from '@/generated/prisma/client';

export const LinkContext = createContext<Link>(null);

export function LinkProvider({ linkId, children }: { linkId?: string; children: ReactNode }) {
  const { data: link } = useLinkQuery(linkId);

  if (!link) {
    return null;
  }

  return <LinkContext.Provider value={link}>{children}</LinkContext.Provider>;
}
