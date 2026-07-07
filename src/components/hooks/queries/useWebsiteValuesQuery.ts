import { useCountryNames } from '@/components/hooks/useCountryNames';
import { useRegionNames } from '@/components/hooks/useRegionNames';
import { useApi } from '../useApi';
import { useLaneQuery } from '../useLaneQuery';
import { useLocale } from '../useLocale';

export function useWebsiteValuesQuery({
  websiteId,
  type,
  startDate,
  endDate,
  search,
}: {
  websiteId: string;
  type: string;
  startDate: Date;
  endDate: Date;
  search?: string;
}) {
  const { get } = useApi();
  const { locale } = useLocale();
  const { countryNames } = useCountryNames(locale);
  const { regionNames } = useRegionNames(locale);

  const names = {
    country: countryNames,
    region: regionNames,
  };

  const getSearch = (type: string, value: string) => {
    if (value) {
      const values = names[type];

      if (values) {
        return (
          Object.keys(values)
            .reduce((arr: string[], key: string) => {
              if (values[key].toLowerCase().includes(value.toLowerCase())) {
                return arr.concat(key);
              }
              return arr;
            }, [])
            .slice(0, 5)
            .join(',') || value
        );
      }

      return value;
    }
  };

  return useLaneQuery({
    laneKey: ['websites:values', { websiteId, type, startDate, endDate, search }],
    loader: ({ signal }) =>
      get(
        `/websites/${websiteId}/values`,
        {
          type,
          startAt: +startDate,
          endAt: +endDate,
          search: getSearch(type, search),
        },
        {},
        { signal },
      ),
    enabled: !!(websiteId && type && startDate && endDate),
  });
}
