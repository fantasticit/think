"use strict";
exports.__esModule = true;
exports.TemplateApiDefinition = void 0;
exports.TemplateApiDefinition = {
    /**
     * 获取公开模板
     */
    public: {
        method: 'get',
        server: 'public',
        client: function () { return '/template/public'; }
    },
    /**
     * 获取个人创建模板
     */
    own: {
        method: 'get',
        server: 'own',
        client: function () { return '/template/own'; }
    },
    /**
     * 新建模板
     */
    add: {
        method: 'post',
        server: 'add',
        client: function () { return '/template/add'; }
    },
    /**
     * 更新模板
     */
    updateById: {
        method: 'patch',
        server: 'update/:id',
        client: function (id) { return "/template/update/".concat(id); }
    },
    /**
     * 获取模板详情
     */
    getDetailById: {
        method: 'get',
        server: 'detail/:id',
        client: function (id) { return "/template/detail/".concat(id); }
    },
    /**
     * 删除模板
     */
    deleteById: {
        method: 'delete',
        server: 'delete/:id',
        client: function (id) { return "/template/delete/".concat(id); }
    }
};
