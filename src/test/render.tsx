import {
  type RenderOptions,
  screen,
  render as testingLibraryRender,
  waitFor,
  within,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RouterProvider, ZenProvider } from '@umami/react-zen';
import { NextIntlClientProvider } from 'next-intl';
import type { ReactElement, ReactNode } from 'react';
import { LaneProvider } from 'use-lane';
import enUS from '../../public/intl/messages/en-US.json';
import { setTestUrl } from './navigation';

type TestRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  locale?: string;
  messages?: Record<string, unknown>;
  route?: string;
};

function TestProviders({
  children,
  locale = 'en-US',
  messages = enUS,
}: {
  children: ReactNode;
  locale?: string;
  messages?: Record<string, unknown>;
}) {
  return (
    <ZenProvider>
      <RouterProvider navigate={url => window.history.pushState({}, '', url)}>
        <NextIntlClientProvider locale={locale} messages={messages} onError={() => null}>
          <LaneProvider>{children}</LaneProvider>
        </NextIntlClientProvider>
      </RouterProvider>
    </ZenProvider>
  );
}

export function render(
  ui: ReactElement,
  { locale = 'en-US', messages = enUS, route = '/', ...options }: TestRenderOptions = {},
) {
  setTestUrl(route);

  return {
    user: userEvent.setup(),
    ...testingLibraryRender(ui, {
      wrapper: ({ children }) => (
        <TestProviders locale={locale} messages={messages}>
          {children}
        </TestProviders>
      ),
      ...options,
    }),
  };
}

export { screen, userEvent, waitFor, within };
