import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { MentorDetail } from '@/lib/api-types';

export const mentorDetailQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ['mentors', id],
    queryFn: async () => {
      const { data } = await api.get<{ data: MentorDetail }>(`/mentors/${id}`);
      return data.data;
    },
    enabled: !!id,
  });

export const useMentorDetail = (id: string) => useQuery(mentorDetailQueryOptions(id));
