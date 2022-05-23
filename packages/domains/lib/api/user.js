"use strict";
exports.__esModule = true;
exports.UserApiDefinition = void 0;
exports.UserApiDefinition = {
    /**
     * 获取用户
     */
    getAllUsers: {
        method: 'Get',
        server: '/',
        client: function () { return '/user'; }
    },
    /**
     * 注册
     */
    register: {
        method: 'Post',
        server: 'register',
        client: function () { return '/user/register'; }
    },
    /**
     * 登录
     */
    login: {
        method: 'Post',
        server: 'login',
        client: function () { return '/user/login'; }
    },
    /**
     * 登出
     */
    logout: {
        method: 'Post',
        server: 'logout',
        client: function () { return '/user/logout'; }
    },
    /**
     * 更新
     */
    update: {
        method: 'Patch',
        server: 'update',
        client: function () { return "/user/update"; }
    }
};
