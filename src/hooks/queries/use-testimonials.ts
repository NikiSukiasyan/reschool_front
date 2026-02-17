import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Testimonial } from '@/lib/api-types';

export const testimonialsQueryOptions = queryOptions({
  queryKey: ['testimonials'],
  queryFn: async () => {
    const { data } = await api.get<{ data: Testimonial[] }>('/testimonials');
    return data.data;
  },
});

export const useTestimonials = () => useQuery(testimonialsQueryOptions);
