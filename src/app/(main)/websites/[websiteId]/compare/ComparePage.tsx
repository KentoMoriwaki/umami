'use client';
import { Column } from '@umami/react-zen';
import { WebsiteChart } from '@/app/(main)/websites/[websiteId]/WebsiteChart';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { WebsiteMetricsBar } from '@/app/(main)/websites/[websiteId]/WebsiteMetricsBar';
import { DataFallback, DataSuspense } from '@/components/common/DataSuspense';
import { Panel } from '@/components/common/Panel';
import { CompareTables } from './CompareTables';

export function ComparePage({ websiteId }: { websiteId: string }) {
  return (
    <Column gap>
      <WebsiteControls websiteId={websiteId} allowCompare={true} />
      <DataSuspense fallback={<DataFallback minHeight="136px" />}>
        <WebsiteMetricsBar websiteId={websiteId} compareMode={true} showChange={true} />
      </DataSuspense>
      <Panel minHeight="520px">
        <WebsiteChart websiteId={websiteId} compareMode={true} />
      </Panel>
      <CompareTables websiteId={websiteId} />
    </Column>
  );
}
