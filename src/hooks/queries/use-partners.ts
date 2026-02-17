import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Partner } from '@/lib/api-types';

export const partnersQueryOptions = queryOptions({
  queryKey: ['partners'],
  queryFn: async () => {
    const { data } = await api.get<{ data: Partner[] }>('/partners');
    return data.data;
  },
});

export const usePartners = () => useQuery(partnersQueryOptions);
