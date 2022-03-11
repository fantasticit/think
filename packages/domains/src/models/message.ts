import { IUser } from "./user";

/**
 * 消息数据定义
 */
export interface IMessage {
  id: string;
  userId: IUser["id"];
  title: string;
  message: string;
  url: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
