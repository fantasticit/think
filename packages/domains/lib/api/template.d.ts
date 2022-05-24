import { ITemplate } from '../models';
export declare const TemplateApiDefinition: {
    /**
     * 获取公开模板
     */
    public: {
        method: "get";
        server: "public";
        client: () => string;
    };
    /**
     * 获取个人创建模板
     */
    own: {
        method: "get";
        server: "own";
        client: () => string;
    };
    /**
     * 新建模板
     */
    add: {
        method: "post";
        server: "add";
        client: () => string;
    };
    /**
     * 更新模板
     */
    updateById: {
        method: "patch";
        server: "update/:id";
        client: (id: ITemplate['id']) => string;
    };
    /**
     * 获取模板详情
     */
    getDetailById: {
        method: "get";
        server: "detail/:id";
        client: (id: ITemplate['id']) => string;
    };
    /**
     * 删除模板
     */
    deleteById: {
        method: "delete";
        server: "delete/:id";
        client: (id: ITemplate['id']) => string;
    };
};
