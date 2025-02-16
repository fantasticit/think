"use strict";
exports.__esModule = true;
exports.AdApiDefinition = void 0;
exports.AdApiDefinition = {
    /**
     * 获取用户
     */
    getAll: {
        method: 'get',
        server: '',
        client: function () { return '/ad'; }
    },
    create: {
        method: 'post',
        server: '',
        client: function () { return '/ad'; }
    },
    /**
     * 获取组织内加星的知识库
     */
    deleteById: {
        method: 'delete',
        server: ':id',
        client: function (id) { return "/ad/".concat(id); }
    }
};
