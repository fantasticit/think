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
     * 注册
     */
    register: {
        method: "post";
        server: "register";
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
};
