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
     * 获取验证码
     */
    sendVerifyCode: {
        method: 'get',
        server: 'sendVerifyCode',
        client: function () { return '/verify/sendVerifyCode'; }
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
     * 重置密码
     */
    resetPassword: {
        method: 'post',
        server: 'resetPassword',
        client: function () { return '/user/resetPassword'; }
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
    },
    /**
     * 锁定用户
     */
    toggleLockUser: {
        method: 'post',
        server: 'lock/user',
        client: function () { return "/user/lock/user"; }
    },
    /**
     * 获取系统配置
     */
    getSystemConfig: {
        method: 'get',
        server: 'config/system',
        client: function () { return "/user/config/system"; }
    },
    /**
     * 发送测试邮件
     */
    sendTestEmail: {
        method: 'get',
        server: 'config/system/sendTestEmail',
        client: function () { return "/user/config/system/sendTestEmail"; }
    },
    /**
     * 发送测试邮件
     */
    updateSystemConfig: {
        method: 'post',
        server: 'config/system/updateSystemConfig',
        client: function () { return "/user/config/system/updateSystemConfig"; }
    }
};
