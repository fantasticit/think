import { IDocument, IWiki, StarApiDefinition } from '@think/domains';
import { event, TOGGLE_STAR_DOUCMENT, TOGGLE_STAR_WIKI, triggerToggleStarDocument, triggerToggleStarWiki } from 'event';
import { useCallback, useEffect } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
import { HttpClient } from 'services/http-client';

export type IWikiWithIsMember = IWiki & { isMember?: boolean };

/**
 * 获取组织内加星的知识库
 * @returns
 */
export const getStarWikisInOrganization = (organizationId, cookie = null): Promise<IWikiWithIsMember[]> => {
  return HttpClient.request({
    method: StarApiDefinition.getStarWikisInOrganization.method,
    url: StarApiDefinition.getStarWikisInOrganization.client(organizationId),
    cookie,
  });
};

/**
 * 获取组织内加星的知识库
 * @returns
 */
export const useStarWikisInOrganization = (organizationId) => {
  const { data, error, isLoading, refetch } = useQuery(
    StarApiDefinition.getStarWikisInOrganization.client(organizationId),
    () => getStarWikisInOrganization(organizationId),
    {
      staleTime: 500,
    }
  );

  useEffect(() => {
    event.on(TOGGLE_STAR_WIKI, refetch);

    return () => {
      event.off(TOGGLE_STAR_WIKI, refetch);
    };
  }, [refetch]);

  return { data, error, loading: isLoading, refresh: refetch };
};

/**
 * 检查知识库是否收藏
 * @param wikiId
 * @returns
 */
export const getWikiIsStar = (organizationId, wikiId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: StarApiDefinition.isStared.method,
    url: StarApiDefinition.isStared.client(),
    cookie,
    data: {
      organizationId,
      wikiId,
    },
  });
};

/**
 * 收藏（或取消收藏）知识库
 * @param wikiId
 * @returns
 */
export const toggleStarWiki = (organizationId, wikiId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: StarApiDefinition.toggleStar.method,
    url: StarApiDefinition.toggleStar.client(),
    cookie,
    data: {
      organizationId,
      wikiId,
    },
  });
};

/**
 * 加星或取消
 * @param wikiId
 * @returns
 */
export const useWikiStarToggle = (organizationId, wikiId) => {
  const { data, error, refetch } = useQuery([StarApiDefinition.toggleStar.client(), organizationId, wikiId], () =>
    getWikiIsStar(organizationId, wikiId)
  );

  const toggle = useCallback(async () => {
    await toggleStarWiki(organizationId, wikiId);
    refetch();
    triggerToggleStarWiki();
  }, [refetch, organizationId, wikiId]);

  return { data, error, toggle };
};

/**
 * 获取用户收藏的文档
 * @returns
 */
export const getStarDocumentsInOrganization = (organizationId, cookie = null): Promise<IDocument[]> => {
  return HttpClient.request({
    method: StarApiDefinition.getStarDocumentsInOrganization.method,
    url: StarApiDefinition.getStarDocumentsInOrganization.client(organizationId),
    cookie,
  });
};

/**
 * 获取用户收藏的文档
 * @returns
 */
export const useStarDocumentsInOrganization = (organizationId) => {
  const { data, error, isLoading, refetch } = useQuery(
    StarApiDefinition.getStarDocumentsInOrganization.client(organizationId),
    () => getStarDocumentsInOrganization(organizationId),
    {
      staleTime: 500,
    }
  );
  useEffect(() => {
    event.on(TOGGLE_STAR_DOUCMENT, refetch);

    return () => {
      event.off(TOGGLE_STAR_DOUCMENT, refetch);
    };
  }, [refetch]);
  return { data, error, loading: isLoading, refresh: refetch };
};

/**
 * 检查文档是否收藏
 * @param documentId
 * @returns
 */
export const getDocumentIsStar = (organizationId, wikiId, documentId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: StarApiDefinition.isStared.method,
    url: StarApiDefinition.isStared.client(),
    cookie,
    data: {
      organizationId,
      wikiId,
      documentId,
    },
  });
};

/**
 * 收藏（或取消收藏）知识库
 * @param wikiId
 * @returns
 */
export const toggleDocumentStar = (organizationId, wikiId, documentId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: StarApiDefinition.toggleStar.method,
    url: StarApiDefinition.toggleStar.client(),
    cookie,
    data: {
      organizationId,
      wikiId,
      documentId,
    },
  });
};

/**
 * 文档收藏管理
 * @param documentId
 * @returns
 */
export const useDocumentStarToggle = (organizationId, wikiId, documentId, options?: UseQueryOptions<boolean>) => {
  const { data, error, refetch } = useQuery(
    [StarApiDefinition.isStared.client(), organizationId, wikiId, documentId],
    () => getDocumentIsStar(organizationId, wikiId, documentId),
    options
  );

  const toggle = useCallback(async () => {
    await toggleDocumentStar(organizationId, wikiId, documentId);
    refetch();
    triggerToggleStarDocument();
  }, [refetch, organizationId, wikiId, documentId]);

  return { data, error, toggle };
};

/**
 * 获取知识库加星的文档
 * @returns
 */
export const getStarDocumentsInWiki = (organizationId, wikiId, cookie = null): Promise<IWikiWithIsMember[]> => {
  return HttpClient.request({
    method: StarApiDefinition.getStarDocumentsInWiki.method,
    url: StarApiDefinition.getStarDocumentsInWiki.client(),
    cookie,
    params: {
      organizationId,
      wikiId,
    },
  });
};

/**
 * 获取知识库加星的文档
 * @returns
 */
export const useStarDocumentsInWiki = (organizationId, wikiId) => {
  const { data, error, isLoading, refetch } = useQuery(
    [StarApiDefinition.getStarDocumentsInWiki.client(), organizationId, wikiId],
    () => getStarDocumentsInWiki(organizationId, wikiId),
    {
      staleTime: 500,
    }
  );

  useEffect(() => {
    event.on(TOGGLE_STAR_DOUCMENT, refetch);

    return () => {
      event.off(TOGGLE_STAR_DOUCMENT, refetch);
    };
  }, [refetch]);

  return { data, error, loading: isLoading, refresh: refetch };
};
