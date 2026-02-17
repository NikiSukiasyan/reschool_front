import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { HomePageData } from '@/lib/api-types';

export const homeQueryOptions = queryOptions({
  queryKey: ['home'],
  queryFn: async () => {
    const { data } = await api.get<HomePageData>('/home');
    return data;
  },
  staleTime: 5 * 60 * 1000, // 5 minutes
});

export const useHomePage = () => useQuery(homeQueryOptions);
