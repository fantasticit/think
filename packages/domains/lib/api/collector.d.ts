import { IDocument, IWiki, CollectType } from '../models';
export declare type CollectorApiTypeDefinition = {
    toggle: {
        request: {
            targetId: IDocument['id'] | IWiki['id'];
            type: CollectType;
        };
    };
    check: {
        request: {
            targetId: IDocument['id'] | IWiki['id'];
            type: CollectType;
        };
    };
};
export declare const CollectorApiDefinition: {
    /**
     * 收藏（或取消收藏）
     */
    toggle: {
        method: "post";
        server: "toggle";
        client: () => string;
    };
    /**
     * 检测是否收藏
     */
    check: {
        method: "post";
        server: "check";
        client: () => string;
    };
    /**
     * 获取收藏的知识库
     */
    wikis: {
        method: "get";
        server: "wikis";
        client: () => string;
    };
    /**
     * 获取收藏的文档
     */
    documents: {
        method: "get";
        server: "documents";
        client: () => string;
    };
};
