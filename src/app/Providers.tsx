'use client';
import { Loading, RouterProvider, ZenProvider } from '@umami/react-zen';
import { useRouter } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { Suspense, useEffect } from 'react';
import { LaneProvider } from 'use-lane';
import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { useLocale } from '@/components/hooks';
import 'chartjs-adapter-date-fns';

function MessagesProvider({ children }) {
  const { locale, messages, dir } = useLocale();

  useEffect(() => {
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', locale);
  }, [locale, dir]);

  return (
    <NextIntlClientProvider locale={locale} messages={messages[locale]} onError={() => null}>
      {children}
    </NextIntlClientProvider>
  );
}

export function Providers({ children }) {
  const router = useRouter();

  function navigate(url: string) {
    if (shouldUseNativeLink(url)) {
      window.location.href = url;
    } else {
      router.push(url);
    }
  }

  function shouldUseNativeLink(url: string) {
    return url.startsWith('http');
  }

  return (
    <ZenProvider>
      <RouterProvider navigate={navigate}>
        <MessagesProvider>
          <LaneProvider>
            <ErrorBoundary>
              <Suspense fallback={<Loading placement="absolute" />}>{children}</Suspense>
            </ErrorBoundary>
          </LaneProvider>
        </MessagesProvider>
      </RouterProvider>
    </ZenProvider>
  );
}
