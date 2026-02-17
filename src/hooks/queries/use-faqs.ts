import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Faq } from '@/lib/api-types';

export const faqsQueryOptions = queryOptions({
  queryKey: ['faqs'],
  queryFn: async () => {
    const { data } = await api.get<{ data: Faq[] }>('/faqs');
    return data.data;
  },
});

export const useFaqs = () => useQuery(faqsQueryOptions);
