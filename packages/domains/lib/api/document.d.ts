import { IDocument } from '../models';
export declare const DocumentApiDefinition: {
    /**
     * 搜索文档
     */
    search: {
        method: "get";
        server: "/:organizationId/search";
        client: (organizationId: any) => string;
    };
    /**
     * 获取用户最近访问的文档
     */
    recent: {
        method: "get";
        server: "/:organizationId/recent";
        client: (organizationId: any) => string;
    };
    /**
     * 新建文档
     */
    create: {
        method: "post";
        server: "create";
        client: () => string;
    };
    /**
     * 获取文档详情
     */
    getDetailById: {
        method: "get";
        server: "detail/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 导出文档
     */
    exportDocx: {
        method: "post";
        server: "/export/docx";
        client: () => string;
    };
    /**
     * 更新文档
     */
    updateById: {
        method: "patch";
        server: "update/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 获取文档版本记录
     */
    getVersionById: {
        method: "get";
        server: "version/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 获取文档成员
     */
    getMemberById: {
        method: "get";
        server: "member/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 添加文档成员
     */
    addMemberById: {
        method: "post";
        server: "member/:id/add";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 更新文档成员
     */
    updateMemberById: {
        method: "patch";
        server: "member/:id/update";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 删除文档成员
     */
    deleteMemberById: {
        method: "post";
        server: "member/:id/delete";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 获取子文档
     */
    getChildren: {
        method: "post";
        server: "children";
        client: () => string;
    };
    /**
     * 删除文档
     */
    deleteById: {
        method: "delete";
        server: "delete/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 分享文档
     */
    shareById: {
        method: "post";
        server: "share/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 获取公开文档详情
     */
    getPublicDetailById: {
        method: "post";
        server: "public/detail/:id";
        client: (id: IDocument['id']) => string;
    };
    /**
     * 获取公开文档的子文档
     */
    getPublicChildren: {
        method: "post";
        server: "public/children";
        client: () => string;
    };
};
