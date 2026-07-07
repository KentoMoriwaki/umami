import { ClientSuspense } from '@/components/common/ClientSuspense';
import { SharePage } from './SharePage';

export default function () {
  return (
    <ClientSuspense>
      <SharePage />
    </ClientSuspense>
  );
}
