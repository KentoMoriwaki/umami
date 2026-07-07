import type { Metadata } from 'next';
import { ClientSuspense } from '@/components/common/ClientSuspense';
import { LoginPage } from './LoginPage';

export const dynamic = 'force-dynamic';

export default async function () {
  if (process.env.DISABLE_LOGIN || process.env.CLOUD_MODE) {
    return null;
  }

  return (
    <ClientSuspense>
      <LoginPage />
    </ClientSuspense>
  );
}

export const metadata: Metadata = {
  title: 'Login',
};
