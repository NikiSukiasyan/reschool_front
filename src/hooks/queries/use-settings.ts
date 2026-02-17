import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { SettingsResponse } from '@/lib/api-types';

export const settingsQueryOptions = queryOptions({
  queryKey: ['settings'],
  queryFn: async () => {
    const { data } = await api.get<SettingsResponse>('/settings');
    return data;
  },
  staleTime: 10 * 60 * 1000, // 10 minutes
  gcTime: 30 * 60 * 1000, // 30 minutes
});

export const useSettings = () => useQuery(settingsQueryOptions);
