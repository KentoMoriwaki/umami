'use client';
import { Column, Grid } from '@umami/react-zen';
import { WebsiteControls } from '@/app/(main)/websites/[websiteId]/WebsiteControls';
import { DataSuspense } from '@/components/common/DataSuspense';
import { LoadingPanel } from '@/components/common/LoadingPanel';
import { Panel } from '@/components/common/Panel';
import { SectionHeader } from '@/components/common/SectionHeader';
import { useDateRange, useNavigation, useReportsQuery } from '@/components/hooks';
import { Goal } from './Goal';
import { GoalAddButton } from './GoalAddButton';

export function GoalsPage({ websiteId }: { websiteId: string }) {
  return (
    <DataSuspense>
      <GoalsPageContent websiteId={websiteId} />
    </DataSuspense>
  );
}

function GoalsPageContent({ websiteId }: { websiteId: string }) {
  const { data, error } = useReportsQuery({ websiteId, type: 'goal' });
  const {
    dateRange: { startDate, endDate },
  } = useDateRange();
  const { pathname } = useNavigation();
  const isSharePage = pathname.includes('/share/');

  return (
    <Column gap>
      <WebsiteControls websiteId={websiteId} />
      {!isSharePage && (
        <SectionHeader>
          <GoalAddButton websiteId={websiteId} />
        </SectionHeader>
      )}
      <LoadingPanel data={data} error={error}>
        {data && (
          <Grid columns={{ base: '1fr', md: '1fr 1fr' }} gap>
            {data.data.map((report: any) => (
              <Panel key={report.id}>
                <Goal {...report} startDate={startDate} endDate={endDate} />
              </Panel>
            ))}
          </Grid>
        )}
      </LoadingPanel>
    </Column>
  );
}
