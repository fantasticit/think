import { IWiki } from '../models';
export declare const WikiApiDefinition: {
    /**
     * 获取用户所有知识库（创建的、参与的）
     */
    getAllWikis: {
        method: "get";
        server: "list/all/:organizationId";
        client: (organizationId: any) => string;
    };
    /**
     * 获取用户创建的知识库
     */
    getOwnWikis: {
        method: "get";
        server: "list/own/:organizationId";
        client: (organizationId: any) => string;
    };
    /**
     * 获取用户参与的知识库
     */
    getJoinWikis: {
        method: "get";
        server: "list/join/:organizationId";
        client: (organizationId: any) => string;
    };
    /**
     * 新建知识库
     */
    add: {
        method: "post";
        server: "add";
        client: () => string;
    };
    /**
     * 获取知识库首页文档
     */
    getHomeDocumentById: {
        method: "get";
        server: "homedoc/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取知识库目录
     */
    getTocsById: {
        method: "get";
        server: "tocs/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 更新知识库目录
     */
    updateTocsById: {
        method: "patch";
        server: "tocs/:id/update";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取知识库所有文档
     */
    getDocumentsById: {
        method: "get";
        server: "documents/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取知识库详情
     */
    getDetailById: {
        method: "get";
        server: "detail/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 更新知识库
     */
    updateById: {
        method: "patch";
        server: "update/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 删除知识库
     */
    deleteById: {
        method: "delete";
        server: "delet/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取知识库成员
     */
    getMemberById: {
        method: "get";
        server: "member/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 添加知识库成员
     */
    addMemberById: {
        method: "post";
        server: "member/:id/add";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 更新知识库成员
     */
    updateMemberById: {
        method: "patch";
        server: "member/:id/update";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 删除知识库成员
     */
    deleteMemberById: {
        method: "delete";
        server: "member/:id/delete";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 分享知识库
     */
    shareById: {
        method: "post";
        server: "share/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取公开知识库首页文档
     */
    getPublicHomeDocumentById: {
        method: "get";
        server: "/public/homedoc/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取公开知识库目录
     */
    getPublicTocsById: {
        method: "get";
        server: "/public/tocs/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取知识库详情
     */
    getPublicDetailById: {
        method: "get";
        server: "/public/detail/:id";
        client: (id: IWiki['id']) => string;
    };
    /**
     * 获取所有公开知识库
     */
    getPublicWikis: {
        method: "get";
        server: "/public/wikis";
        client: () => string;
    };
};
