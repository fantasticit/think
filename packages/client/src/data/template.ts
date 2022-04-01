import type { ITemplate } from '@think/domains';
import { useState } from 'react';
import useSWR from 'swr';
import { HttpClient } from 'services/http-client';

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

  const addTemplate = async (data): Promise<ITemplate> => {
    const ret = await HttpClient.post(`/template/add`, data);
    mutate();
    return ret as unknown as ITemplate;
  };

  return {
    data,
    loading,
    error,
    setPage,
    addTemplate,
  };
};

export const useTemplate = (templateId) => {
  const { data, error, mutate } = useSWR<ITemplate>(`/template/detail/${templateId}`, (url) => HttpClient.get(url), {
    revalidateOnMount: true,
  });
  const loading = !data && !error;

  const updateTemplate = async (data): Promise<ITemplate> => {
    const ret = await HttpClient.post(`/template/update`, {
      id: templateId,
      ...data,
    });
    mutate();
    return ret as unknown as ITemplate;
  };

  const deleteTemplate = async () => {
    await HttpClient.post(`/template/delete/${templateId}`);
  };

  return {
    data,
    loading,
    error,
    updateTemplate,
    deleteTemplate,
  };
};
