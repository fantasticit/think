import { IDocument, IWiki, StarApiDefinition } from '@think/domains';
import { event, TOGGLE_STAR_DOUCMENT, TOGGLE_STAR_WIKI, triggerToggleStarDocument, triggerToggleStarWiki } from 'event';
import { useCallback, useEffect } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
import { HttpClient } from 'services/http-client';

export type IWikiWithIsMember = IWiki & { isMember?: boolean };

/**
 * 获取用户收藏的知识库
 * @returns
 */
export const getStarWikis = (cookie = null): Promise<IWikiWithIsMember[]> => {
  return HttpClient.request({
    method: StarApiDefinition.wikis.method,
    url: StarApiDefinition.wikis.client(),
    cookie,
  });
};

/**
 * 获取用户收藏的知识库
 * @returns
 */
export const useStarWikis = () => {
  const { data, error, isLoading, refetch } = useQuery(StarApiDefinition.wikis.client(), getStarWikis, {
    staleTime: 500,
  });

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
export const getWikiIsStar = (wikiId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: StarApiDefinition.check.method,
    url: StarApiDefinition.check.client(),
    cookie,
    data: {
      wikiId,
    },
  });
};

/**
 * 收藏（或取消收藏）知识库
 * @param wikiId
 * @returns
 */
export const toggleStarWiki = (wikiId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: StarApiDefinition.toggle.method,
    url: StarApiDefinition.toggle.client(),
    cookie,
    data: {
      wikiId,
    },
  });
};

/**
 * 收藏知识库
 * @param wikiId
 * @returns
 */
export const useWikiStarToggle = (wikiId) => {
  const { data, error, refetch } = useQuery([StarApiDefinition.check.client(), wikiId], () => getWikiIsStar(wikiId));

  const toggle = useCallback(async () => {
    await toggleStarWiki(wikiId);
    refetch();
    triggerToggleStarWiki();
  }, [refetch, wikiId]);

  return { data, error, toggle };
};

/**
 * 获取用户收藏的文档
 * @returns
 */
export const getStarDocuments = (cookie = null): Promise<IDocument[]> => {
  return HttpClient.request({
    method: StarApiDefinition.documents.method,
    url: StarApiDefinition.documents.client(),
    cookie,
  });
};

/**
 * 获取用户收藏的文档
 * @returns
 */
export const useStarDocuments = () => {
  const { data, error, isLoading, refetch } = useQuery(StarApiDefinition.documents.client(), getStarDocuments, {
    staleTime: 500,
  });
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
export const getDocumentIsStar = (wikiId, documentId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: StarApiDefinition.check.method,
    url: StarApiDefinition.check.client(),
    cookie,
    data: {
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
export const toggleDocumentStar = (wikiId, documentId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: StarApiDefinition.toggle.method,
    url: StarApiDefinition.toggle.client(),
    cookie,
    data: {
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
export const useDocumentStarToggle = (wikiId, documentId, options?: UseQueryOptions<boolean>) => {
  const { data, error, refetch } = useQuery(
    [StarApiDefinition.check.client(), wikiId, documentId],
    () => getDocumentIsStar(wikiId, documentId),
    options
  );

  const toggle = useCallback(async () => {
    await toggleDocumentStar(wikiId, documentId);
    refetch();
    triggerToggleStarDocument();
  }, [refetch, wikiId, documentId]);

  return { data, error, toggle };
};

/**
 * 获取知识库加星的文档
 * @returns
 */
export const getWikiStarDocuments = (wikiId, cookie = null): Promise<IWikiWithIsMember[]> => {
  return HttpClient.request({
    method: StarApiDefinition.wikiDocuments.method,
    url: StarApiDefinition.wikiDocuments.client(),
    cookie,
    params: {
      wikiId,
    },
  });
};

/**
 * 获取知识库加星的文档
 * @returns
 */
export const useWikiStarDocuments = (wikiId) => {
  const { data, error, isLoading, refetch } = useQuery(
    [StarApiDefinition.wikiDocuments.client(), wikiId],
    () => getWikiStarDocuments(wikiId),
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
