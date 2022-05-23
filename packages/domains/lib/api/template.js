"use strict";
exports.__esModule = true;
exports.TemplateApiDefinition = void 0;
exports.TemplateApiDefinition = {
    /**
     * 获取公开模板
     */
    public: {
        method: 'Get',
        server: 'public',
        client: function () { return '/template/public'; }
    },
    /**
     * 获取个人创建模板
     */
    own: {
        method: 'Get',
        server: 'own',
        client: function () { return '/template/own'; }
    },
    /**
     * 新建模板
     */
    add: {
        method: 'Post',
        server: 'add',
        client: function () { return '/template/add'; }
    },
    /**
     * 更新模板
     */
    updateById: {
        method: 'Patch',
        server: 'update/:id',
        client: function (id) { return "/template/update/".concat(id); }
    },
    /**
     * 获取模板详情
     */
    getDetailById: {
        method: 'Get',
        server: 'detail/:id',
        client: function (id) { return "/template/detail/".concat(id); }
    },
    /**
     * 删除模板
     */
    deleteById: {
        method: 'Delete',
        server: 'delete/:id',
        client: function (id) { return "/template/delete/".concat(id); }
    }
};
