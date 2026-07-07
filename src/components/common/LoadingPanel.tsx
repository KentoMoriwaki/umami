import { Column, type ColumnProps, Loading } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { Empty } from '@/components/common/Empty';
import { ErrorMessage } from '@/components/common/ErrorMessage';

export interface LoadingPanelProps extends ColumnProps {
  data?: any;
  error?: unknown;
  isEmpty?: boolean;
  isLoading?: boolean;
  isFetching?: boolean;
  loadingIcon?: 'dots' | 'spinner';
  loadingPlacement?: 'center' | 'absolute' | 'inline';
  renderEmpty?: () => ReactNode;
  children: ReactNode;
}

export function LoadingPanel({
  data,
  error,
  isEmpty,
  isLoading,
  isFetching,
  loadingIcon = 'dots',
  loadingPlacement = 'absolute',
  renderEmpty = () => <Empty />,
  children,
  ...props
}: LoadingPanelProps): ReactNode {
  const empty = isEmpty ?? checkEmpty(data);

  // Show loading spinner only if no data exists
  if (isLoading) {
    return (
      <Column position="relative" height="100%" width="100%" {...props}>
        <Loading icon={loadingIcon} placement={loadingPlacement} />
      </Column>
    );
  }

  // Show error
  if (error && empty) {
    return <ErrorMessage />;
  }

  // Show empty state (once loaded)
  if (!error && !isLoading && empty) {
    return renderEmpty();
  }

  // Show main content when data exists
  if (!isLoading && !empty) {
    return (
      <>
        {children}
        {isFetching && <Loading icon={loadingIcon} placement={loadingPlacement} />}
      </>
    );
  }

  return null;
}

function checkEmpty(data: any) {
  if (!data) return false;

  if (Array.isArray(data)) {
    return data.length <= 0;
  }

  if (typeof data === 'object') {
    return Object.keys(data).length <= 0;
  }

  return !!data;
}
