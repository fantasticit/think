import { IOrganization } from '../models';
export declare const OrganizationApiDefinition: {
    /**
     * 创建
     */
    createOrganization: {
        method: "post";
        server: "/create";
        client: () => string;
    };
    /**
     * 获取用户个人组织
     */
    getPersonalOrganization: {
        method: "get";
        server: "/personal";
        client: () => string;
    };
    /**
     * 获取用户除个人组织外其他组织
     */
    getUserOrganizations: {
        method: "get";
        server: "/list/personal";
        client: () => string;
    };
    /**
     * 获取组织详情
     */
    getOrganizationDetail: {
        method: "get";
        server: "/detail/:id";
        client: (id: IOrganization['id']) => string;
    };
    /**
     * 更新组织基本信息
     */
    updateOrganization: {
        method: "post";
        server: "/update/:id";
        client: (id: IOrganization['id']) => string;
    };
    /**
     * 更新组织基本信息
     */
    deleteOrganization: {
        method: "delete";
        server: "/delete/:id";
        client: (id: IOrganization['id']) => string;
    };
    /**
     * 获取组织成员
     */
    getMembers: {
        method: "get";
        server: "/member/:id";
        client: (id: IOrganization['id']) => string;
    };
    /**
     * 添加组织成员
     */
    addMemberById: {
        method: "post";
        server: "member/:id/add";
        client: (id: IOrganization['id']) => string;
    };
    /**
     * 更新组织成员
     */
    updateMemberById: {
        method: "patch";
        server: "member/:id/update";
        client: (id: IOrganization['id']) => string;
    };
    /**
     * 删除组织成员
     */
    deleteMemberById: {
        method: "delete";
        server: "member/:id/delete";
        client: (id: IOrganization['id']) => string;
    };
};
