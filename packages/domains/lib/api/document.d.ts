import { IDocument } from '../models';
export declare const DocumentApiDefinition: {
    /**
     * 搜索文档
     */
    search: {
        method: "Get";
        server: "search";
        client: () => string;
    };
    /**
     * 获取用户最近访问的文档
     */
    recent: {
        method: "Get";
        server: "recent";
        client: () => string;
    };
    /**
     * 新建文档
     */
    create: {
        method: "Post";
        server: "create";
        client: () => string;
    };
    /**
     * 获取文档详情
     */
    getDetailById: {
        method: "Get";
        server: "detail/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 更新文档
     */
    updateById: {
        method: "Patch";
        server: "update/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 获取文档版本记录
     */
    getVersionById: {
        method: "Get";
        server: "version/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 获取文档成员
     */
    getMemberById: {
        method: "Get";
        server: "member/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 添加文档成员
     */
    addMemberById: {
        method: "Post";
        server: "member/:id/add";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 更新文档成员
     */
    updateMemberById: {
        method: "Patch";
        server: "member/:id/update";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 删除文档成员
     */
    deleteMemberById: {
        method: "Post";
        server: "member/:id/delete";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 获取子文档
     */
    getChildren: {
        method: "Get";
        server: "children";
        client: () => string;
    };
    /**
     * 删除文档
     */
    deleteById: {
        method: "Delete";
        server: "delete/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 分享文档
     */
    shareById: {
        method: "Post";
        server: "share/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 获取公开文档详情
     */
    getPublicDetailById: {
        method: "Get";
        server: "public/detail/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 获取公开文档的子文档
     */
    getPublicChildren: {
        method: "Get";
        server: "public/children";
        client: () => string;
    };
};
