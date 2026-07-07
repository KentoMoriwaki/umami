'use client';
import { TeamSettings } from '@/app/(main)/teams/[teamId]/TeamSettings';
import { TeamProvider } from '@/app/(main)/teams/TeamProvider';
import { DataSuspense } from '@/components/common/DataSuspense';

export function AdminTeamPage({ teamId }: { teamId: string }) {
  return (
    <DataSuspense>
      <TeamProvider teamId={teamId}>
        <TeamSettings teamId={teamId} />
      </TeamProvider>
    </DataSuspense>
  );
}
