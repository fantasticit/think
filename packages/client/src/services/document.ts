import { IDocument } from "@think/domains";
import { HttpClient } from "./HttpClient";

/**
 * 更新文档阅读量
 * @param id
 * @returns
 */
export const updateDocumentViews = (id: string) => {
  return HttpClient.get("/document/views/" + id);
};

/**
 * 获取公开文档详情
 * @param id
 * @param data
 * @returns
 */
export const getPublicDocumentDetail = (
  id: string,
  data: Partial<Pick<IDocument, "sharePassword">>
): Promise<IDocument> => {
  return HttpClient.post("/document/public/detail/" + id, data);
};

/**
 * 搜索文档
 * @param keyword
 * @returns
 */
export const searchDocument = (keyword: string): Promise<IDocument[]> => {
  return HttpClient.get("/document/search", { params: { keyword } });
};
