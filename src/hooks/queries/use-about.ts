import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { AboutPageData } from '@/lib/api-types';

export const aboutQueryOptions = queryOptions({
  queryKey: ['about'],
  queryFn: async () => {
    const { data } = await api.get<AboutPageData>('/about');
    return data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

export const useAboutPage = () => useQuery(aboutQueryOptions);
