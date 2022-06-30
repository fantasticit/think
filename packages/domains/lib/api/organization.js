"use strict";
exports.__esModule = true;
exports.OrganizationApiDefinition = void 0;
exports.OrganizationApiDefinition = {
    /**
     * 创建
     */
    createOrganization: {
        method: 'post',
        server: '/create',
        client: function () { return '/organization/create'; }
    },
    /**
     * 获取用户个人组织
     */
    getPersonalOrganization: {
        method: 'get',
        server: '/personal',
        client: function () { return '/organization/personal'; }
    },
    /**
     * 获取用户除个人组织外其他组织
     */
    getUserOrganizations: {
        method: 'get',
        server: '/list/personal',
        client: function () { return '/organization/list/personal'; }
    },
    /**
     * 获取组织详情
     */
    getOrganizationDetail: {
        method: 'get',
        server: '/detail/:id',
        client: function (id) { return "/organization/detail/".concat(id); }
    },
    /**
     * 更新组织基本信息
     */
    updateOrganization: {
        method: 'post',
        server: '/update/:id',
        client: function (id) { return "/organization/update/".concat(id); }
    },
    /**
     * 更新组织基本信息
     */
    deleteOrganization: {
        method: 'delete',
        server: '/delete/:id',
        client: function (id) { return "/organization/delete/".concat(id); }
    },
    /**
     * 获取组织成员
     */
    getMembers: {
        method: 'get',
        server: '/member/:id',
        client: function (id) { return "/organization/member/".concat(id); }
    },
    /**
     * 添加组织成员
     */
    addMemberById: {
        method: 'post',
        server: 'member/:id/add',
        client: function (id) { return "/organization/member/".concat(id, "/add"); }
    },
    /**
     * 更新组织成员
     */
    updateMemberById: {
        method: 'patch',
        server: 'member/:id/update',
        client: function (id) { return "/organization/member/".concat(id, "/update"); }
    },
    /**
     * 删除组织成员
     */
    deleteMemberById: {
        method: 'delete',
        server: 'member/:id/delete',
        client: function (id) { return "/organization/member/".concat(id, "/delete"); }
    }
};
