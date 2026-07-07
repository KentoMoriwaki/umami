import { LoadingPanel } from '@/components/common/LoadingPanel';
import { useMessages } from '@/components/hooks';
import { useWebsiteSessionStatsQuery } from '@/components/hooks/queries/useWebsiteSessionStatsQuery';
import { MetricCard } from '@/components/metrics/MetricCard';
import { MetricsBar } from '@/components/metrics/MetricsBar';
import { formatLongNumber } from '@/lib/format';

export function EventsMetricsBar({ websiteId }: { websiteId: string }) {
  const { t, labels } = useMessages();
  const { data, isFetching, refreshError } = useWebsiteSessionStatsQuery(websiteId);

  return (
    <LoadingPanel data={data} isFetching={isFetching} refreshError={refreshError}>
      {data && (
        <MetricsBar>
          <MetricCard
            value={data?.visitors?.value}
            label={t(labels.visitors)}
            formatValue={formatLongNumber}
          />
          <MetricCard
            value={data?.visits?.value}
            label={t(labels.visits)}
            formatValue={formatLongNumber}
          />
          <MetricCard
            value={data?.pageviews?.value}
            label={t(labels.views)}
            formatValue={formatLongNumber}
          />
          <MetricCard
            value={data?.events?.value}
            label={t(labels.events)}
            formatValue={formatLongNumber}
          />
        </MetricsBar>
      )}
    </LoadingPanel>
  );
}
