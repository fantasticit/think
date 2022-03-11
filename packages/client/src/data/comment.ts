import type { IComment } from "@think/domains";
import { useState } from "react";
import useSWR from "swr";
import { HttpClient } from "services/HttpClient";

export type CreateCommentDto = Pick<
  IComment,
  "parentCommentId" | "html" | "replyUserId"
>;

export type UpdateCommentDto = Pick<IComment, "id" | "html">;

/**
 * 文档评论
 * @param documentId
 * @returns
 */
export const useComments = (documentId) => {
  const [page, setPage] = useState(1);
  const { data, error, mutate } = useSWR<{
    data: Array<IComment>;
    total: number;
  }>(`/comment/document/${documentId}?page=${page}`, (url) =>
    HttpClient.get(url)
  );
  const loading = !data && !error;

  const addComment = async (data: CreateCommentDto) => {
    const ret = await HttpClient.post(`/comment/add`, {
      documentId,
      ...data,
    });
    mutate();
    return ret;
  };

  const updateComment = async (data: UpdateCommentDto) => {
    const ret = await HttpClient.post(`/comment/update`, {
      documentId,
      ...data,
    });
    mutate();
    return ret;
  };

  const deleteComment = async (comment: IComment) => {
    const ret = await HttpClient.post(`/comment/delete/${comment.id}`);
    mutate();
    return ret;
  };

  return {
    data,
    loading,
    error,
    setPage,
    addComment,
    updateComment,
    deleteComment,
  };
};
