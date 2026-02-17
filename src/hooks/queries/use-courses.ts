import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { CourseList, CourseDetail } from '@/lib/api-types';

export const coursesQueryOptions = queryOptions({
  queryKey: ['courses'],
  queryFn: async () => {
    const { data } = await api.get<{ data: CourseList[] }>('/courses');
    return data.data;
  },
});

export const courseQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ['courses', slug],
    queryFn: async () => {
      const { data } = await api.get<{ data: CourseDetail }>(`/courses/${slug}`);
      return data.data;
    },
    enabled: !!slug,
  });

export const useCourses = () => useQuery(coursesQueryOptions);

export const useCourse = (slug: string) => useQuery(courseQueryOptions(slug));
