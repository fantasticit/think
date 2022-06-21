import { CollectorApiDefinition, CollectType, IDocument, IWiki } from '@think/domains';
import {
  event,
  TOGGLE_COLLECT_DOUCMENT,
  TOGGLE_COLLECT_WIKI,
  triggerToggleCollectDocument,
  triggerToggleCollectWiki,
} from 'event';
import { useCallback, useEffect } from 'react';
import { useQuery, UseQueryOptions } from 'react-query';
import { HttpClient } from 'services/http-client';

export type IWikiWithIsMember = IWiki & { isMember?: boolean };

/**
 * 获取用户收藏的知识库
 * @returns
 */
export const getCollectedWikis = (cookie = null): Promise<IWikiWithIsMember[]> => {
  return HttpClient.request({
    method: CollectorApiDefinition.wikis.method,
    url: CollectorApiDefinition.wikis.client(),
    cookie,
  });
};

/**
 * 获取用户收藏的知识库
 * @returns
 */
export const useCollectedWikis = () => {
  const { data, error, isLoading, refetch } = useQuery(CollectorApiDefinition.wikis.client(), getCollectedWikis, {
    staleTime: 500,
  });

  useEffect(() => {
    event.on(TOGGLE_COLLECT_WIKI, refetch);

    return () => {
      event.off(TOGGLE_COLLECT_WIKI, refetch);
    };
  }, [refetch]);

  return { data, error, loading: isLoading, refresh: refetch };
};

/**
 * 检查知识库是否收藏
 * @param wikiId
 * @returns
 */
export const getWikiIsCollected = (wikiId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: CollectorApiDefinition.check.method,
    url: CollectorApiDefinition.check.client(),
    cookie,
    data: {
      type: CollectType.wiki,
      targetId: wikiId,
    },
  });
};

/**
 * 收藏（或取消收藏）知识库
 * @param wikiId
 * @returns
 */
export const toggleCollectWiki = (wikiId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: CollectorApiDefinition.toggle.method,
    url: CollectorApiDefinition.toggle.client(),
    cookie,
    data: {
      type: CollectType.wiki,
      targetId: wikiId,
    },
  });
};

/**
 * 收藏知识库
 * @param wikiId
 * @returns
 */
export const useWikiCollectToggle = (wikiId) => {
  const { data, error, refetch } = useQuery([CollectorApiDefinition.check.client(), wikiId], () =>
    getWikiIsCollected(wikiId)
  );

  const toggle = useCallback(async () => {
    await toggleCollectWiki(wikiId);
    refetch();
    triggerToggleCollectWiki();
  }, [refetch, wikiId]);

  return { data, error, toggle };
};

/**
 * 获取用户收藏的文档
 * @returns
 */
export const getCollectedDocuments = (cookie = null): Promise<IDocument[]> => {
  return HttpClient.request({
    method: CollectorApiDefinition.documents.method,
    url: CollectorApiDefinition.documents.client(),
    cookie,
  });
};

/**
 * 获取用户收藏的文档
 * @returns
 */
export const useCollectedDocuments = () => {
  const { data, error, isLoading, refetch } = useQuery(
    CollectorApiDefinition.documents.client(),
    getCollectedDocuments,
    { staleTime: 500 }
  );
  useEffect(() => {
    event.on(TOGGLE_COLLECT_DOUCMENT, refetch);

    return () => {
      event.off(TOGGLE_COLLECT_DOUCMENT, refetch);
    };
  }, [refetch]);
  return { data, error, loading: isLoading, refresh: refetch };
};

/**
 * 检查文档是否收藏
 * @param documentId
 * @returns
 */
export const getDocumentIsCollected = (documentId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: CollectorApiDefinition.check.method,
    url: CollectorApiDefinition.check.client(),
    cookie,
    data: {
      type: CollectType.document,
      targetId: documentId,
    },
  });
};

/**
 * 收藏（或取消收藏）知识库
 * @param wikiId
 * @returns
 */
export const toggleCollectDocument = (documentId, cookie = null): Promise<boolean> => {
  return HttpClient.request({
    method: CollectorApiDefinition.toggle.method,
    url: CollectorApiDefinition.toggle.client(),
    cookie,
    data: {
      type: CollectType.document,
      targetId: documentId,
    },
  });
};

/**
 * 文档收藏管理
 * @param documentId
 * @returns
 */
export const useDocumentCollectToggle = (documentId, options?: UseQueryOptions<boolean>) => {
  const { data, error, refetch } = useQuery(
    [CollectorApiDefinition.check.client(), documentId],
    () => getDocumentIsCollected(documentId),
    options
  );

  const toggle = useCallback(async () => {
    await toggleCollectDocument(documentId);
    refetch();
    triggerToggleCollectDocument();
  }, [refetch, documentId]);

  return { data, error, toggle };
};
