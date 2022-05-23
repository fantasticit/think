import { IComment, IDocument } from '../models';
export declare const CommentApiDefinition: {
    /**
     * 新建评论
     */
    add: {
        method: "Post";
        server: "add";
        client: () => string;
    };
    /**
     * 更新评论
     */
    update: {
        method: "Patch";
        server: "update";
        client: () => string;
    };
    /**
     * 删除评论
     */
    delete: {
        method: "Delete";
        server: "delete/:id";
        client: (id: IComment['id']) => string;
    };
    /**
     * 获取指定文档评论
     */
    documents: {
        method: "Get";
        server: "document/:documentId";
        client: (documentId: IDocument['id']) => string;
    };
};
