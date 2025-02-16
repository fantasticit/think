import { useCallback } from 'react';
import { useQuery } from 'react-query';

import { AdApiDefinition, IAd } from '@think/domains';

import { HttpClient } from 'services/http-client';

export const useAd = () => {
  const { data, error, isLoading, refetch } = useQuery(AdApiDefinition.getAll.client(), () =>
    HttpClient.request<IAd>({
      method: AdApiDefinition.getAll.method,
      url: AdApiDefinition.getAll.client(),
    })
  );

  const createAd = useCallback(
    async (data: Partial<IAd>) => {
      const ret = await HttpClient.request<IAd>({
        method: AdApiDefinition.create.method,
        url: AdApiDefinition.create.client(),
        data,
      });
      refetch();
      return ret;
    },
    [refetch]
  );

  const deleteAd = useCallback(
    async (id: IAd['id']) => {
      const ret = await HttpClient.request<IAd>({
        method: AdApiDefinition.deleteById.method,
        url: AdApiDefinition.deleteById.client(id),
      });
      refetch();
      return ret;
    },
    [refetch]
  );

  return { data, error, loading: isLoading, refresh: refetch, createAd, deleteAd };
};
