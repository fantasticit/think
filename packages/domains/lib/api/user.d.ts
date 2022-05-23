export declare const UserApiDefinition: {
    /**
     * 获取用户
     */
    getAllUsers: {
        method: "Get";
        server: "/";
        client: () => string;
    };
    /**
     * 注册
     */
    register: {
        method: "Post";
        server: "register";
        client: () => string;
    };
    /**
     * 登录
     */
    login: {
        method: "Post";
        server: "login";
        client: () => string;
    };
    /**
     * 登出
     */
    logout: {
        method: "Post";
        server: "logout";
        client: () => string;
    };
    /**
     * 更新
     */
    update: {
        method: "Patch";
        server: "update";
        client: () => string;
    };
};
