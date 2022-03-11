import { IUser, IWiki, IDocument, CollectType } from "../models";
export declare type ICollectDto = {
  targetId: IWiki["id"] | IDocument["id"];
  type: CollectType;
};
export declare abstract class ICollectorService {
  /**
   * 知识库
   */
  wikis = [];
  getWikisLoading = false;
  getWikisError = null;

  /**
   * 文档
   */
  documents = [];
  getDocumentsLoading = false;
  getDocumentsError = null;

  /**
   * 收藏（或取消收藏）
   */
  toggleLoading = false;
  toggleError = null;

  /**
   * 检查是否收藏
   */
  checkLoading = false;
  checkError = null;

  abstract toggleCollect(data: ICollectDto, user?: IUser): Promise<void>;
  abstract checkCollect(data: ICollectDto): Promise<boolean>;
  abstract getCollectWikis(user?: IUser): Promise<IWiki[]>;
  abstract getCollectDocuments(user?: IUser): Promise<IDocument[]>;
}
