import { useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { RegistrationPayload, RegistrationResponse } from '@/lib/api-types';

export const useRegister = () =>
  useMutation({
    mutationFn: async (payload: RegistrationPayload) => {
      const { data } = await api.post<RegistrationResponse>('/registrations', payload);
      return data;
    },
  });
