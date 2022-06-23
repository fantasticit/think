"use strict";
exports.__esModule = true;
exports.StarApiDefinition = void 0;
exports.StarApiDefinition = {
    /**
     * 收藏（或取消收藏）
     */
    toggle: {
        method: 'post',
        server: 'toggle',
        client: function () { return '/star/toggle'; }
    },
    /**
     * 检测是否收藏
     */
    check: {
        method: 'post',
        server: 'check',
        client: function () { return '/star/check'; }
    },
    /**
     * 获取收藏的知识库
     */
    wikis: {
        method: 'get',
        server: 'wikis',
        client: function () { return '/star/wikis'; }
    },
    /**
     * 获取知识库内加星的文章
     */
    wikiDocuments: {
        method: 'get',
        server: 'wiki/documents',
        client: function () { return '/star/wiki/documents'; }
    },
    /**
     * 获取收藏的文档
     */
    documents: {
        method: 'get',
        server: 'documents',
        client: function () { return '/star/documents'; }
    }
};
