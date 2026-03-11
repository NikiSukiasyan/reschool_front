import { queryOptions, useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { GalleryData } from '@/lib/api-types';

export const galleryQueryOptions = queryOptions({
  queryKey: ['gallery'],
  queryFn: async () => {
    const { data } = await api.get<GalleryData>('/gallery');
    return data;
  },
});

export const useGallery = () => useQuery(galleryQueryOptions);
