"use strict";
exports.__esModule = true;
exports.CommentApiDefinition = void 0;
exports.CommentApiDefinition = {
    /**
     * 新建评论
     */
    add: {
        method: 'post',
        server: 'add',
        client: function () { return '/comment/add'; }
    },
    /**
     * 更新评论
     */
    update: {
        method: 'patch',
        server: 'update',
        client: function () { return '/comment/update'; }
    },
    /**
     * 删除评论
     */
    "delete": {
        method: 'delete',
        server: 'delete/:id',
        client: function (id) { return "/comment/delete/".concat(id); }
    },
    /**
     * 获取指定文档评论
     */
    documents: {
        method: 'get',
        server: 'document/:documentId',
        client: function (documentId) { return "/comment/document/".concat(documentId); }
    }
};
