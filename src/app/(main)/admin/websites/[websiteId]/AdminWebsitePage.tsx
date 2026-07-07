'use client';
import { WebsiteSettings } from '@/app/(main)/websites/[websiteId]/settings/WebsiteSettings';
import { WebsiteProvider } from '@/app/(main)/websites/WebsiteProvider';
import { DataSuspense } from '@/components/common/DataSuspense';
import { Panel } from '@/components/common/Panel';

export function AdminWebsitePage({ websiteId }: { websiteId: string }) {
  return (
    <DataSuspense>
      <WebsiteProvider websiteId={websiteId}>
        <Panel>
          <WebsiteSettings websiteId={websiteId} />
        </Panel>
      </WebsiteProvider>
    </DataSuspense>
  );
}
