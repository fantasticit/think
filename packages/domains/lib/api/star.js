"use strict";
exports.__esModule = true;
exports.StarApiDefinition = void 0;
exports.StarApiDefinition = {
    /**
     * 加星或取消
     */
    toggleStar: {
        method: 'post',
        server: 'toggle',
        client: function () { return '/star/toggle'; }
    },
    /**
     * 检测是否收藏
     */
    isStared: {
        method: 'post',
        server: 'isStared',
        client: function () { return '/star/isStared'; }
    },
    /**
     * 获取组织内加星的知识库
     */
    getStarWikisInOrganization: {
        method: 'get',
        server: '/:organizationId/wikis',
        client: function (organizationId) { return "/star/".concat(organizationId, "/wikis"); }
    },
    /**
     * 获取知识库内加星的文章
     */
    getStarDocumentsInWiki: {
        method: 'get',
        server: '/wiki/documents',
        client: function () { return "/star/wiki/documents"; }
    },
    /**
     * 获取组织内加星的文档
     */
    getStarDocumentsInOrganization: {
        method: 'get',
        server: '/:organizationId/documents',
        client: function (organizationId) { return "/star/".concat(organizationId, "/documents"); }
    }
};
