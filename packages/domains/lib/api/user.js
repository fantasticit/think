"use strict";
exports.__esModule = true;
exports.UserApiDefinition = void 0;
exports.UserApiDefinition = {
    /**
     * 获取用户
     */
    getAllUsers: {
        method: 'get',
        server: '/',
        client: function () { return '/user'; }
    },
    /**
     * 注册
     */
    register: {
        method: 'post',
        server: 'register',
        client: function () { return '/user/register'; }
    },
    /**
     * 登录
     */
    login: {
        method: 'post',
        server: 'login',
        client: function () { return '/user/login'; }
    },
    /**
     * 登出
     */
    logout: {
        method: 'post',
        server: 'logout',
        client: function () { return '/user/logout'; }
    },
    /**
     * 更新
     */
    update: {
        method: 'patch',
        server: 'update',
        client: function () { return "/user/update"; }
    }
};
