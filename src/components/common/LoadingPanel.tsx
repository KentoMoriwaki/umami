import { Column, type ColumnProps, Icon, Loading, Row, Text } from '@umami/react-zen';
import type { ReactNode } from 'react';
import { Empty } from '@/components/common/Empty';
import { ErrorMessage } from '@/components/common/ErrorMessage';
import { useMessages } from '@/components/hooks';
import { AlertTriangle } from '@/components/icons';

export interface LoadingPanelProps extends ColumnProps {
  data?: any;
  error?: unknown;
  isEmpty?: boolean;
  isFetching?: boolean;
  refreshError?: unknown;
  loadingIcon?: 'dots' | 'spinner';
  loadingPlacement?: 'center' | 'absolute' | 'inline';
  renderEmpty?: () => ReactNode;
  children: ReactNode;
}

export function LoadingPanel({
  data,
  error,
  isEmpty,
  isFetching,
  refreshError,
  loadingIcon = 'dots',
  loadingPlacement = 'absolute',
  renderEmpty = () => <Empty />,
  children,
  ...props
}: LoadingPanelProps): ReactNode {
  const empty = isEmpty ?? checkEmpty(data);

  if (error && empty) {
    return <ErrorMessage />;
  }

  if (!error && empty) {
    return renderEmpty();
  }

  if (!empty) {
    return (
      <Column position="relative" width="100%" {...props}>
        {children}
        {refreshError && <RefreshErrorHint error={refreshError} />}
        {isFetching && <Loading icon={loadingIcon} placement={loadingPlacement} />}
      </Column>
    );
  }

  return null;
}

function RefreshErrorHint({ error }: { error: unknown }) {
  const { getErrorMessage } = useMessages();

  return (
    <Row alignItems="center" gap="2" marginTop="2">
      <Icon>
        <AlertTriangle />
      </Icon>
      <Text>{getErrorMessage(error instanceof Error ? error : new Error(String(error)))}</Text>
    </Row>
  );
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
