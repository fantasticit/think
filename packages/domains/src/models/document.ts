import { IUser } from "./user";
import { IWiki } from "./wiki";

/**
 * 文档状态枚举
 */
export enum DocumentStatus {
  private = "private",
  public = "public",
}

/**
 * 文档数据定义
 */
export interface IDocument {
  id: string;
  wikiId: IWiki["id"];
  isWikiHome: boolean;
  createUserId: IUser["id"];
  createUser: IUser;
  parentDocumentId?: IDocument["id"];
  title: string;
  content: string;
  status: DocumentStatus;
  views: number;
  sharePassword?: string;
  createdAt: Date;
  updatedAt: Date;
  children?: IDocument[];
}

/**
 * 文档成员权限数据定义
 */
export interface IAuthority {
  id: string;
  documentId: IDocument["id"];
  userId: IUser["id"];
  readable: boolean;
  editable: boolean;
}
