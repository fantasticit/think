import type { ITemplate } from '@think/domains';
import { useCallback, useState } from 'react';
import { HttpClient } from 'services/http-client';
import useSWR from 'swr';

export const usePublicTemplates = () => {
  const [page, setPage] = useState(1);
  const { data, error, mutate } = useSWR<{
    data: Array<ITemplate>;
    total: number;
  }>(`/template/public?page=${page}`, (url) => HttpClient.get(url));
  const loading = !data && !error;

  return {
    data,
    loading,
    error,
    setPage,
  };
};

/**
 * 个人模板
 * @returns
 */
export const useOwnTemplates = () => {
  const [page, setPage] = useState(1);
  const { data, error, mutate } = useSWR<{
    data: Array<ITemplate>;
    total: number;
  }>(`/template/own?page=${page}`, (url) => HttpClient.get(url));
  const loading = !data && !error;

  const addTemplate = useCallback(
    async (data): Promise<ITemplate> => {
      const ret = await HttpClient.post(`/template/add`, data);
      mutate();
      return ret as unknown as ITemplate;
    },
    [mutate]
  );

  return {
    data,
    loading,
    error,
    setPage,
    addTemplate,
  };
};

export const useTemplate = (templateId) => {
  const { data, error, mutate } = useSWR<ITemplate>(`/template/detail/${templateId}`, (url) => HttpClient.get(url));
  const loading = !data && !error;

  const updateTemplate = useCallback(
    async (data): Promise<ITemplate> => {
      const ret = await HttpClient.post(`/template/update`, {
        id: templateId,
        ...data,
      });
      mutate();
      return ret as unknown as ITemplate;
    },
    [mutate, templateId]
  );

  const deleteTemplate = useCallback(async () => {
    await HttpClient.post(`/template/delete/${templateId}`);
  }, [templateId]);

  return {
    data,
    loading,
    error,
    updateTemplate,
    deleteTemplate,
  };
};
