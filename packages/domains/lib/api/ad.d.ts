export declare const AdApiDefinition: {
    /**
     * 获取用户
     */
    getAll: {
        method: "get";
        server: "";
        client: () => string;
    };
    create: {
        method: "post";
        server: "";
        client: () => string;
    };
    /**
     * 获取组织内加星的知识库
     */
    deleteById: {
        method: "delete";
        server: ":id";
        client: (id: any) => string;
    };
};
