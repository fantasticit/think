"use strict";
exports.__esModule = true;
exports.CollectorApiDefinition = void 0;
exports.CollectorApiDefinition = {
    /**
     * 收藏（或取消收藏）
     */
    toggle: {
        method: 'Post',
        server: 'toggle',
        client: function () { return '/collector/toggle'; }
    },
    /**
     * 检测是否收藏
     */
    check: {
        method: 'Post',
        server: 'check',
        client: function () { return '/collector/check'; }
    },
    /**
     * 获取收藏的知识库
     */
    wikis: {
        method: 'Post',
        server: 'wikis',
        client: function () { return '/collector/wikis'; }
    },
    /**
     * 获取收藏的文档
     */
    documents: {
        method: 'Post',
        server: 'documents',
        client: function () { return '/collector/documents'; }
    }
};
