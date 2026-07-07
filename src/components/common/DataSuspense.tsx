import { Column, type ColumnProps, Loading } from '@umami/react-zen';
import { type ReactNode, Suspense } from 'react';

export function DataFallback({
  minHeight = '300px',
  icon = 'dots',
  placement = 'absolute',
  ...props
}: ColumnProps & {
  icon?: 'dots' | 'spinner';
  placement?: 'center' | 'absolute' | 'inline';
}) {
  return (
    <Column position="relative" minHeight={minHeight} width="100%" {...props}>
      <Loading icon={icon} placement={placement} />
    </Column>
  );
}

export function DataSuspense({
  children,
  fallback = <DataFallback />,
}: {
  children: ReactNode;
  fallback?: ReactNode;
}) {
  return <Suspense fallback={fallback}>{children}</Suspense>;
}
