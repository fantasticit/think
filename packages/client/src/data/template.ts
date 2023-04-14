import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';

import { ITemplate, TemplateApiDefinition } from '@think/domains';

import { HttpClient } from 'services/http-client';

export const getPublicTemplates = (
  page = 1,
  pageSize = 12,
  cookie = null
): Promise<{
  data: Array<ITemplate>;
  total: number;
}> => {
  return HttpClient.request({
    method: TemplateApiDefinition.public.method,
    url: TemplateApiDefinition.public.client(),
    cookie,
    params: {
      page,
      pageSize,
    },
  });
};

export const usePublicTemplates = (pageSize = 12) => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useQuery([TemplateApiDefinition.public.client(), page], () =>
    getPublicTemplates(page, pageSize)
  );

  return {
    data,
    loading: isLoading,
    error,
    page,
    setPage,
    refresh: refetch,
  };
};

export const getOwnTemplates = (
  page = 1,
  pageSize = 12,
  cookie = null
): Promise<{
  data: Array<ITemplate>;
  total: number;
}> => {
  return HttpClient.request({
    method: TemplateApiDefinition.own.method,
    url: TemplateApiDefinition.own.client(),
    cookie,
    params: {
      page,
      pageSize,
    },
  });
};

/**
 * 个人模板
 * @returns
 */
export const useOwnTemplates = (pageSize = 12) => {
  const [page, setPage] = useState(1);
  const {
    data,
    error,
    isLoading,
    refetch: mutate,
  } = useQuery([TemplateApiDefinition.own.client(), page], () => getOwnTemplates(page, pageSize));

  const addTemplate = useCallback(
    async (data): Promise<ITemplate> => {
      const ret = await HttpClient.post(TemplateApiDefinition.add.client(), data);
      mutate();
      return ret as unknown as ITemplate;
    },
    [mutate]
  );

  return {
    data,
    loading: isLoading,
    error,
    page,
    setPage,
    addTemplate,
    refresh: mutate,
  };
};

/**
 * 获取模板详情
 * @param templateId
 * @param cookie
 * @returns
 */
export const getTemplateDetail = (templateId, cookie = null): Promise<ITemplate> => {
  return HttpClient.request({
    method: TemplateApiDefinition.getDetailById.method,
    url: TemplateApiDefinition.getDetailById.client(templateId),
    cookie,
  });
};

/**
 * 获取模板详情
 * @param templateId
 * @returns
 */
export const useTemplate = (templateId) => {
  const { data, error, refetch } = useQuery(TemplateApiDefinition.getDetailById.client(templateId), () =>
    getTemplateDetail(templateId)
  );
  const loading = !data && !error;

  const updateTemplate = useCallback(
    async (data): Promise<ITemplate> => {
      const ret = await HttpClient.request({
        method: TemplateApiDefinition.updateById.method,
        url: TemplateApiDefinition.updateById.client(templateId),
        data: {
          id: templateId,
          ...data,
        },
      });
      refetch();
      return ret as unknown as ITemplate;
    },
    [refetch, templateId]
  );

  const deleteTemplate = useCallback(async () => {
    await HttpClient.request({
      method: TemplateApiDefinition.deleteById.method,
      url: TemplateApiDefinition.deleteById.client(templateId),
    });
  }, [templateId]);

  return {
    data,
    loading,
    error,
    updateTemplate,
    deleteTemplate,
  };
};
