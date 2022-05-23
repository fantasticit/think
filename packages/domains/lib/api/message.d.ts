import { IMessage } from '../models';
export declare const MessageApiDefinition: {
    /**
     * 获取未读消息
     */
    getUnread: {
        method: "Get";
        server: "unread";
        client: () => string;
    };
    /**
     * 获取已读消息
     */
    getRead: {
        method: "Get";
        server: "read";
        client: () => string;
    };
    /**
     * 获取所有消息
     */
    getAll: {
        method: "Get";
        server: "all";
        client: () => string;
    };
    /**
     * 将消息标记为已读
     */
    readMessage: {
        method: "Post";
        server: "read/:id";
        client: (id: IMessage['id']) => string;
    };
};
