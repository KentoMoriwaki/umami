import { createContext, type ReactNode } from 'react';
import { useUserQuery } from '@/components/hooks/queries/useUserQuery';
import type { User } from '@/generated/prisma/client';

export const UserContext = createContext<User>(null);

export function UserProvider({ userId, children }: { userId: string; children: ReactNode }) {
  const { data: user } = useUserQuery(userId);

  if (!user) {
    return null;
  }

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}
