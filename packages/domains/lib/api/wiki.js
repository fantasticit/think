"use strict";
exports.__esModule = true;
exports.WikiApiDefinition = void 0;
exports.WikiApiDefinition = {
    /**
     * 获取用户所有知识库（创建的、参与的）
     */
    getAllWikis: {
        method: 'Get',
        server: 'list/all',
        client: function () { return '/wiki/list/all'; }
    },
    /**
     * 获取用户创建的知识库
     */
    getOwnWikis: {
        method: 'Get',
        server: 'list/own',
        client: function () { return '/wiki/list/own'; }
    },
    /**
     * 获取用户参与的知识库
     */
    getJoinWikis: {
        method: 'Get',
        server: 'list/join',
        client: function () { return '/wiki/list/join'; }
    },
    /**
     * 新建知识库
     */
    add: {
        method: 'Post',
        server: 'add',
        client: function () { return '/wiki/add'; }
    },
    /**
     * 获取知识库首页文档
     */
    getHomeDocumentById: {
        method: 'Get',
        server: 'homedoc/:id',
        client: function (id) { return "/wiki/homedoc/".concat(id); }
    },
    /**
     * 获取知识库目录
     */
    getTocsById: {
        method: 'Get',
        server: 'tocs/:id',
        client: function (id) { return "/wiki/tocs/".concat(id); }
    },
    /**
     * 更新知识库目录
     */
    updateTocsById: {
        method: 'Patch',
        server: 'tocs/:id/update',
        client: function (id) { return "/wiki/tocs/".concat(id, "/update"); }
    },
    /**
     * 获取知识库所有文档
     */
    getDocumentsById: {
        method: 'Get',
        server: 'documents/:id',
        client: function (id) { return "/wiki/documents/".concat(id); }
    },
    /**
     * 获取知识库详情
     */
    getDetailById: {
        method: 'Get',
        server: 'detail/:id',
        client: function (id) { return "/wiki/detail/".concat(id); }
    },
    /**
     * 更新知识库
     */
    updateById: {
        method: 'Patch',
        server: 'update/:id',
        client: function (id) { return "/wiki/update/".concat(id); }
    },
    /**
     * 删除知识库
     */
    deleteById: {
        method: 'Delete',
        server: 'delet/:id',
        client: function (id) { return "/wiki/delet/".concat(id); }
    },
    /**
     * 获取知识库成员
     */
    getMemberById: {
        method: 'Get',
        server: 'member/:id',
        client: function (id) { return "/wiki/member/".concat(id); }
    },
    /**
     * 添加知识库成员
     */
    addMemberById: {
        method: 'Post',
        server: 'member/:id/add',
        client: function (id) { return "/wiki/member/".concat(id, "/add"); }
    },
    /**
     * 更新知识库成员
     */
    updateMemberById: {
        method: 'Patch',
        server: 'member/:id/update',
        client: function (id) { return "/wiki/member/".concat(id, "/update"); }
    },
    /**
     * 删除知识库成员
     */
    deleteMemberById: {
        method: 'Delete',
        server: 'member/:id/delete',
        client: function (id) { return "/wiki/member/".concat(id, "/delete"); }
    },
    /**
     * 分享知识库
     */
    shareById: {
        method: 'Post',
        server: 'share/:id',
        client: function (id) { return "/wiki/share/".concat(id); }
    },
    /**
     * 获取公开知识库首页文档
     */
    getPublicHomeDocumentById: {
        method: 'Get',
        server: '/public/homedoc/:id',
        client: function (id) { return "/wiki/public/homedoc/".concat(id); }
    },
    /**
     * 获取公开知识库目录
     */
    getPublicTocsById: {
        method: 'Get',
        server: '/public/tocs/:id',
        client: function (id) { return "/wiki/public/tocs/".concat(id); }
    },
    /**
     * 获取知识库详情
     */
    getPublicDetailById: {
        method: 'Get',
        server: '/public/detail/:id',
        client: function (id) { return "/wiki/public/detail/".concat(id); }
    },
    /**
     * 获取所有公开知识库
     */
    getPublicWikis: {
        method: 'Get',
        server: '/public/wikis',
        client: function (id) { return "/wiki/public/wikis"; }
    }
};
