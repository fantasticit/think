import { IWiki } from '../models';
export declare const WikiApiDefinition: {
    /**
     * 获取用户所有知识库（创建的、参与的）
     */
    getAllWikis: {
        method: "Get";
        server: "list/all";
        client: () => string;
    };
    /**
     * 获取用户创建的知识库
     */
    getOwnWikis: {
        method: "Get";
        server: "list/own";
        client: () => string;
    };
    /**
     * 获取用户参与的知识库
     */
    getJoinWikis: {
        method: "Get";
        server: "list/join";
        client: () => string;
    };
    /**
     * 新建知识库
     */
    add: {
        method: "Post";
        server: "add";
        client: () => string;
    };
    /**
     * 获取知识库首页文档
     */
    getHomeDocumentById: {
        method: "Get";
        server: "homedoc/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取知识库目录
     */
    getTocsById: {
        method: "Get";
        server: "tocs/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 更新知识库目录
     */
    updateTocsById: {
        method: "Patch";
        server: "tocs/:id/update";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取知识库所有文档
     */
    getDocumentsById: {
        method: "Get";
        server: "documents/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取知识库详情
     */
    getDetailById: {
        method: "Get";
        server: "detail/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 更新知识库
     */
    updateById: {
        method: "Patch";
        server: "update/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 删除知识库
     */
    deleteById: {
        method: "Delete";
        server: "delet/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取知识库成员
     */
    getMemberById: {
        method: "Get";
        server: "member/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 添加知识库成员
     */
    addMemberById: {
        method: "Post";
        server: "member/:id/add";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 更新知识库成员
     */
    updateMemberById: {
        method: "Patch";
        server: "member/:id/update";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 删除知识库成员
     */
    deleteMemberById: {
        method: "Delete";
        server: "member/:id/delete";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 分享知识库
     */
    shareById: {
        method: "Post";
        server: "share/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取公开知识库首页文档
     */
    getPublicHomeDocumentById: {
        method: "Get";
        server: "/public/homedoc/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取公开知识库目录
     */
    getPublicTocsById: {
        method: "Get";
        server: "/public/tocs/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取知识库详情
     */
    getPublicDetailById: {
        method: "Get";
        server: "/public/detail/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取所有公开知识库
     */
    getPublicWikis: {
        method: "Get";
        server: "/public/wikis";
        client: (id: IWiki['id']) => string;
    };
};
