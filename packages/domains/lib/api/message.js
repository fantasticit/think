"use strict";
exports.__esModule = true;
exports.MessageApiDefinition = void 0;
exports.MessageApiDefinition = {
    /**
     * 获取未读消息
     */
    getUnread: {
        method: 'get',
        server: 'unread',
        client: function () { return '/message/unread'; }
    },
    /**
     * 获取已读消息
     */
    getRead: {
        method: 'get',
        server: 'read',
        client: function () { return '/message/read'; }
    },
    /**
     * 获取所有消息
     */
    getAll: {
        method: 'get',
        server: 'all',
        client: function () { return '/message/all'; }
    },
    /**
     * 将消息标记为已读
     */
    readMessage: {
        method: 'post',
        server: 'read/:id',
        client: function (id) { return "/message/read/".concat(id); }
    }
};
