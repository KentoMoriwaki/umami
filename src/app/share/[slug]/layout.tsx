import { ShareProvider } from '@/app/share/ShareProvider';
import { ClientSuspense } from '@/components/common/ClientSuspense';

export default async function ({
  params,
  children,
}: {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}) {
  const { slug } = await params;

  return (
    <ClientSuspense>
      <ShareProvider slug={slug}>{children}</ShareProvider>
    </ClientSuspense>
  );
}
