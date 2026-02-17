import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { BlogPostList, BlogPostDetail } from '@/lib/api-types';

export const blogPostsQueryOptions = queryOptions({
  queryKey: ['blog'],
  queryFn: async () => {
    const { data } = await api.get<{ data: BlogPostList[] }>('/blog');
    return data.data;
  },
});

export const blogPostQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: BlogPostDetail }>(`/blog/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });

export const useBlogPosts = () => useQuery(blogPostsQueryOptions);

export const useBlogPost = (slug: string) => useQuery(blogPostQueryOptions(slug));
