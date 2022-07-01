"use strict";
exports.__esModule = true;
exports.WikiApiDefinition = void 0;
exports.WikiApiDefinition = {
    /**
     * 获取用户所有知识库（创建的、参与的）
     */
    getAllWikis: {
        method: 'get',
        server: 'list/all/:organizationId',
        client: function (organizationId) { return "/wiki/list/all/".concat(organizationId); }
    },
    /**
     * 获取用户创建的知识库
     */
    getOwnWikis: {
        method: 'get',
        server: 'list/own/:organizationId',
        client: function (organizationId) { return "/wiki/list/own/".concat(organizationId); }
    },
    /**
     * 获取用户参与的知识库
     */
    getJoinWikis: {
        method: 'get',
        server: 'list/join/:organizationId',
        client: function (organizationId) { return "/wiki/list/join/".concat(organizationId); }
    },
    /**
     * 新建知识库
     */
    add: {
        method: 'post',
        server: 'add',
        client: function () { return '/wiki/add'; }
    },
    /**
     * 获取知识库首页文档
     */
    getHomeDocumentById: {
        method: 'get',
        server: 'homedoc/:id',
        client: function (id) { return "/wiki/homedoc/".concat(id); }
    },
    /**
     * 获取知识库目录
     */
    getTocsById: {
        method: 'get',
        server: 'tocs/:id',
        client: function (id) { return "/wiki/tocs/".concat(id); }
    },
    /**
     * 更新知识库目录
     */
    updateTocsById: {
        method: 'patch',
        server: 'tocs/:id/update',
        client: function (id) { return "/wiki/tocs/".concat(id, "/update"); }
    },
    /**
     * 获取知识库所有文档
     */
    getDocumentsById: {
        method: 'get',
        server: 'documents/:id',
        client: function (id) { return "/wiki/documents/".concat(id); }
    },
    /**
     * 获取知识库详情
     */
    getDetailById: {
        method: 'get',
        server: 'detail/:id',
        client: function (id) { return "/wiki/detail/".concat(id); }
    },
    /**
     * 更新知识库
     */
    updateById: {
        method: 'patch',
        server: 'update/:id',
        client: function (id) { return "/wiki/update/".concat(id); }
    },
    /**
     * 删除知识库
     */
    deleteById: {
        method: 'delete',
        server: 'delet/:id',
        client: function (id) { return "/wiki/delet/".concat(id); }
    },
    /**
     * 获取知识库成员
     */
    getMemberById: {
        method: 'get',
        server: 'member/:id',
        client: function (id) { return "/wiki/member/".concat(id); }
    },
    /**
     * 添加知识库成员
     */
    addMemberById: {
        method: 'post',
        server: 'member/:id/add',
        client: function (id) { return "/wiki/member/".concat(id, "/add"); }
    },
    /**
     * 更新知识库成员
     */
    updateMemberById: {
        method: 'patch',
        server: 'member/:id/update',
        client: function (id) { return "/wiki/member/".concat(id, "/update"); }
    },
    /**
     * 删除知识库成员
     */
    deleteMemberById: {
        method: 'delete',
        server: 'member/:id/delete',
        client: function (id) { return "/wiki/member/".concat(id, "/delete"); }
    },
    /**
     * 分享知识库
     */
    shareById: {
        method: 'post',
        server: 'share/:id',
        client: function (id) { return "/wiki/share/".concat(id); }
    },
    /**
     * 获取公开知识库首页文档
     */
    getPublicHomeDocumentById: {
        method: 'get',
        server: '/public/homedoc/:id',
        client: function (id) { return "/wiki/public/homedoc/".concat(id); }
    },
    /**
     * 获取公开知识库目录
     */
    getPublicTocsById: {
        method: 'get',
        server: '/public/tocs/:id',
        client: function (id) { return "/wiki/public/tocs/".concat(id); }
    },
    /**
     * 获取知识库详情
     */
    getPublicDetailById: {
        method: 'get',
        server: '/public/detail/:id',
        client: function (id) { return "/wiki/public/detail/".concat(id); }
    },
    /**
     * 获取所有公开知识库
     */
    getPublicWikis: {
        method: 'get',
        server: '/public/wikis',
        client: function () { return "/wiki/public/wikis"; }
    }
};
