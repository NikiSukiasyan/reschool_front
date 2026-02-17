import { queryOptions, useQuery } from '@tanstack/react-query';
import { api, getLocale } from '@/lib/api';

export const translationsQueryOptions = (locale: string) =>
  queryOptions({
    queryKey: ['translations', locale],
    queryFn: async () => {
      const { data } = await api.get<Record<string, string>>('/translations');
      return data;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 60 minutes
  });

export const useTranslations = (locale?: string) =>
  useQuery(translationsQueryOptions(locale ?? getLocale()));
