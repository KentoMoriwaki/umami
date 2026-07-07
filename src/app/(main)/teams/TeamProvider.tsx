'use client';
import { createContext, type ReactNode } from 'react';
import { useTeamQuery } from '@/components/hooks/queries/useTeamQuery';
import type { Team } from '@/generated/prisma/client';

export const TeamContext = createContext<Team>(null);

export function TeamProvider({ teamId, children }: { teamId?: string; children: ReactNode }) {
  const { data: team } = useTeamQuery(teamId);

  if (!team) {
    return null;
  }

  return <TeamContext.Provider value={team}>{children}</TeamContext.Provider>;
}
