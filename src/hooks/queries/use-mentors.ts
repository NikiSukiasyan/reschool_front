import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Mentor } from '@/lib/api-types';

export const mentorsQueryOptions = queryOptions({
  queryKey: ['mentors'],
  queryFn: async () => {
    const { data } = await api.get<{ data: Mentor[] }>('/mentors');
    return data.data;
  },
});

export const useMentors = () => useQuery(mentorsQueryOptions);
