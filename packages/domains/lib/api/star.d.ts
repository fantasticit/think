export declare const StarApiDefinition: {
    /**
     * 加星或取消
     */
    toggleStar: {
        method: "post";
        server: "toggle";
        client: () => string;
    };
    /**
     * 检测是否收藏
     */
    isStared: {
        method: "post";
        server: "isStared";
        client: () => string;
    };
    /**
     * 获取组织内加星的知识库
     */
    getStarWikisInOrganization: {
        method: "get";
        server: "/:organizationId/wikis";
        client: (organizationId: any) => string;
    };
    /**
     * 获取知识库内加星的文章
     */
    getStarDocumentsInWiki: {
        method: "get";
        server: "/wiki/documents";
        client: () => string;
    };
    /**
     * 获取组织内加星的文档
     */
    getStarDocumentsInOrganization: {
        method: "get";
        server: "/:organizationId/documents";
        client: (organizationId: any) => string;
    };
};
