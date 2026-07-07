'use client';
import { Column } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { WebsiteProvider } from '@/app/(main)/websites/WebsiteProvider';
import { DataSuspense } from '@/components/common/DataSuspense';
import { PageBody } from '@/components/common/PageBody';
import { WebsiteHeader } from './WebsiteHeader';

export function WebsiteLayout({ websiteId, children }: { websiteId: string; children: ReactNode }) {
  return (
    <DataSuspense>
      <WebsiteProvider websiteId={websiteId}>
        <PageBody gap>
          <WebsiteHeader showActions />
          <Column>{children}</Column>
        </PageBody>
      </WebsiteProvider>
    </DataSuspense>
  );
}
