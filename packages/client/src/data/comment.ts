import { CommentApiDefinition, IComment } from '@think/domains';
import { useCallback, useState } from 'react';
import { useQuery } from 'react-query';
import { HttpClient } from 'services/http-client';

export type CreateCommentDto = Pick<IComment, 'parentCommentId' | 'html' | 'replyUserId'>;
export type UpdateCommentDto = Pick<IComment, 'id' | 'html'>;

export const getComments = (
  documentId,
  page = 1,
  cookie = null
): Promise<{
  data: Array<IComment>;
  total: number;
}> => {
  return HttpClient.request({
    method: CommentApiDefinition.documents.method,
    url: CommentApiDefinition.documents.client(documentId),
    cookie,
    params: {
      page,
    },
  });
};

/**
 * 文档评论
 * @param documentId
 * @returns
 */
export const useComments = (documentId) => {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, refetch } = useQuery(
    [CommentApiDefinition.documents.client(documentId), page],
    () => getComments(documentId, page),
    { keepPreviousData: true, refetchOnMount: true, refetchOnWindowFocus: true }
  );

  const addComment = useCallback(
    async (data: CreateCommentDto) => {
      const ret = await HttpClient.request({
        method: CommentApiDefinition.add.method,
        url: CommentApiDefinition.add.client(),
        data: {
          documentId,
          ...data,
        },
      });
      refetch();
      return ret;
    },
    [refetch, documentId]
  );

  const updateComment = useCallback(
    async (data: UpdateCommentDto) => {
      const ret = await HttpClient.request({
        method: CommentApiDefinition.update.method,
        url: CommentApiDefinition.update.client(),
        data: {
          documentId,
          ...data,
        },
      });
      refetch();
      return ret;
    },
    [refetch, documentId]
  );

  const deleteComment = useCallback(
    async (comment: IComment) => {
      const ret = await HttpClient.request({
        method: CommentApiDefinition.delete.method,
        url: CommentApiDefinition.delete.client(comment.id),
      });
      refetch();
      return ret;
    },
    [refetch]
  );

  return {
    data,
    loading: isLoading,
    error,
    page,
    setPage,
    addComment,
    updateComment,
    deleteComment,
  };
};
