"use strict";
exports.__esModule = true;
exports.MessageApiDefinition = void 0;
exports.MessageApiDefinition = {
    /**
     * 获取未读消息
     */
    getUnread: {
        method: 'Get',
        server: 'unread',
        client: function () { return '/message/unread'; }
    },
    /**
     * 获取已读消息
     */
    getRead: {
        method: 'Get',
        server: 'read',
        client: function () { return '/message/read'; }
    },
    /**
     * 获取所有消息
     */
    getAll: {
        method: 'Get',
        server: 'all',
        client: function () { return '/message/all'; }
    },
    /**
     * 将消息标记为已读
     */
    readMessage: {
        method: 'Post',
        server: 'read/:id',
        client: function (id) { return "/message/read/".concat(id); }
    }
};
