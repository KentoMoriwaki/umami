import type { Metadata } from 'next';
import { ClientSuspense } from '@/components/common/ClientSuspense';
import { App } from './App';

export default function ({ children }) {
  return (
    <ClientSuspense>
      <App>{children}</App>
    </ClientSuspense>
  );
}

export const metadata: Metadata = {
  title: {
    template: '%s | Umami',
    default: 'Umami',
  },
};
