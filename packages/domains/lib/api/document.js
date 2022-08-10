"use strict";
exports.__esModule = true;
exports.DocumentApiDefinition = void 0;
exports.DocumentApiDefinition = {
    /**
     * 搜索文档
     */
    search: {
        method: 'get',
        server: '/:organizationId/search',
        client: function (organizationId) { return "/document/".concat(organizationId, "/search"); }
    },
    /**
     * 获取用户最近访问的文档
     */
    recent: {
        method: 'get',
        server: '/:organizationId/recent',
        client: function (organizationId) { return "/document/".concat(organizationId, "/recent"); }
    },
    /**
     * 新建文档
     */
    create: {
        method: 'post',
        server: 'create',
        client: function () { return '/document/create'; }
    },
    /**
     * 获取文档详情
     */
    getDetailById: {
        method: 'get',
        server: 'detail/:id',
        client: function (id) { return "/document/detail/".concat(id); }
    },
    /**
     * 导出文档
     */
    exportDocx: {
        method: 'post',
        server: '/export/docx',
        client: function () { return '/document/export/docx'; }
    },
    /**
     * 更新文档
     */
    updateById: {
        method: 'patch',
        server: 'update/:id',
        client: function (id) { return "/document/update/".concat(id); }
    },
    /**
     * 获取文档版本记录
     */
    getVersionById: {
        method: 'get',
        server: 'version/:id',
        client: function (id) { return "/document/version/".concat(id); }
    },
    /**
     * 获取文档成员
     */
    getMemberById: {
        method: 'get',
        server: 'member/:id',
        client: function (id) { return "/document/member/".concat(id); }
    },
    /**
     * 添加文档成员
     */
    addMemberById: {
        method: 'post',
        server: 'member/:id/add',
        client: function (id) { return "/document/member/".concat(id, "/add"); }
    },
    /**
     * 更新文档成员
     */
    updateMemberById: {
        method: 'patch',
        server: 'member/:id/update',
        client: function (id) { return "/document/member/".concat(id, "/update"); }
    },
    /**
     * 删除文档成员
     */
    deleteMemberById: {
        method: 'post',
        server: 'member/:id/delete',
        client: function (id) { return "/document/member/".concat(id, "/delete"); }
    },
    /**
     * 获取子文档
     */
    getChildren: {
        method: 'post',
        server: 'children',
        client: function () { return "/document/children"; }
    },
    /**
     * 删除文档
     */
    deleteById: {
        method: 'delete',
        server: 'delete/:id',
        client: function (id) { return "/document/delete/".concat(id); }
    },
    /**
     * 分享文档
     */
    shareById: {
        method: 'post',
        server: 'share/:id',
        client: function (id) { return "/document/share/".concat(id); }
    },
    /**
     * 获取公开文档详情
     */
    getPublicDetailById: {
        method: 'post',
        server: 'public/detail/:id',
        client: function (id) { return "/document/public/detail/".concat(id); }
    },
    /**
     * 获取公开文档的子文档
     */
    getPublicChildren: {
        method: 'post',
        server: 'public/children',
        client: function () { return "/document/public/children"; }
    }
};
