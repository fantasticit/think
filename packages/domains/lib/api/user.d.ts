export declare const UserApiDefinition: {
    /**
     * 获取用户
     */
    getAllUsers: {
        method: "get";
        server: "/";
        client: () => string;
    };
    /**
     * 获取验证码
     */
    sendVerifyCode: {
        method: "get";
        server: "sendVerifyCode";
        client: () => string;
    };
    /**
     * 注册
     */
    register: {
        method: "post";
        server: "register";
        client: () => string;
    };
    /**
     * 重置密码
     */
    resetPassword: {
        method: "post";
        server: "resetPassword";
        client: () => string;
    };
    /**
     * 登录
     */
    login: {
        method: "post";
        server: "login";
        client: () => string;
    };
    /**
     * 登出
     */
    logout: {
        method: "post";
        server: "logout";
        client: () => string;
    };
    /**
     * 更新
     */
    update: {
        method: "patch";
        server: "update";
        client: () => string;
    };
    /**
     * 锁定用户
     */
    toggleLockUser: {
        method: "post";
        server: "lock/user";
        client: () => string;
    };
    /**
     * 获取系统配置
     */
    getSystemConfig: {
        method: "get";
        server: "config/system";
        client: () => string;
    };
    /**
     * 发送测试邮件
     */
    sendTestEmail: {
        method: "get";
        server: "config/system/sendTestEmail";
        client: () => string;
    };
    /**
     * 发送测试邮件
     */
    updateSystemConfig: {
        method: "post";
        server: "config/system/updateSystemConfig";
        client: () => string;
    };
};
