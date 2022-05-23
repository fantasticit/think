import {
  CollectorApiDefinition,
  CollectorApiTypeDefinition,
  CollectType,
  DocumentApiDefinition,
  IDocument,
  IWiki,
  WikiApiDefinition,
} from '@think/domains';
import { useCallback } from 'react';
import { useQuery } from 'react-query';
import { HttpClient } from 'services/http-client';

type IDocumentWithVisitedAt = IDocument & { visitedAt: string };

/**
 * 获取用户最近访问的文档
 * @returns
 */
export const getRecentVisitedDocuments = (cookie = null): Promise<IDocumentWithVisitedAt[]> => {
  return HttpClient.request({
    method: DocumentApiDefinition.recent.method,
    url: DocumentApiDefinition.recent.client(),
    headers: {
      cookie,
    },
  });
};

/**
 * 获取用户最近访问的文档
 * @returns
 */
export const useRecentDocuments = () => {
  const { data, error, isLoading, refetch } = useQuery(
    DocumentApiDefinition.recent.client(),
    getRecentVisitedDocuments
  );
  return { data, error, loading: isLoading, refresh: refetch };
};
