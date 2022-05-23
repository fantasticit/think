"use strict";
exports.__esModule = true;
exports.DocumentApiDefinition = void 0;
exports.DocumentApiDefinition = {
    /**
     * 搜索文档
     */
    search: {
        method: 'Get',
        server: 'search',
        client: function () { return '/document/search'; }
    },
    /**
     * 获取用户最近访问的文档
     */
    recent: {
        method: 'Get',
        server: 'recent',
        client: function () { return '/document/recent'; }
    },
    /**
     * 新建文档
     */
    create: {
        method: 'Post',
        server: 'create',
        client: function () { return '/document/create'; }
    },
    /**
     * 获取文档详情
     */
    getDetailById: {
        method: 'Get',
        server: 'detail/:id',
        client: function (id) { return "/document/detail/".concat(id); }
    },
    /**
     * 更新文档
     */
    updateById: {
        method: 'Patch',
        server: 'update/:id',
        client: function (id) { return "/document/update/".concat(id); }
    },
    /**
     * 获取文档版本记录
     */
    getVersionById: {
        method: 'Get',
        server: 'version/:id',
        client: function (id) { return "/document/version/".concat(id); }
    },
    /**
     * 获取文档成员
     */
    getMemberById: {
        method: 'Get',
        server: 'member/:id',
        client: function (id) { return "/document/member/".concat(id); }
    },
    /**
     * 添加文档成员
     */
    addMemberById: {
        method: 'Post',
        server: 'member/:id/add',
        client: function (id) { return "/document/member/".concat(id, "/add"); }
    },
    /**
     * 更新文档成员
     */
    updateMemberById: {
        method: 'Patch',
        server: 'member/:id/update',
        client: function (id) { return "/document/member/".concat(id, "/update"); }
    },
    /**
     * 删除文档成员
     */
    deleteMemberById: {
        method: 'Post',
        server: 'member/:id/delete',
        client: function (id) { return "/document/member/".concat(id, "/delete"); }
    },
    /**
     * 获取子文档
     */
    getChildren: {
        method: 'Get',
        server: 'children',
        client: function () { return "/document/children"; }
    },
    /**
     * 删除文档
     */
    deleteById: {
        method: 'Delete',
        server: 'delete/:id',
        client: function (id) { return "/document/delete/".concat(id); }
    },
    /**
     * 分享文档
     */
    shareById: {
        method: 'Post',
        server: 'share/:id',
        client: function (id) { return "/document/share/".concat(id); }
    },
    /**
     * 获取公开文档详情
     */
    getPublicDetailById: {
        method: 'Get',
        server: 'public/detail/:id',
        client: function (id) { return "/document/public/detail/".concat(id); }
    },
    /**
     * 获取公开文档的子文档
     */
    getPublicChildren: {
        method: 'Get',
        server: 'public/children',
        client: function () { return "/document/public/children"; }
    }
};
