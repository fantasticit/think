"use strict";
exports.__esModule = true;
exports.isPublicDocument = exports.isPublicWiki = exports.getWikiStatusText = exports.DOCUMENT_STATUS = exports.WIKI_USER_ROLES = exports.WIKI_STATUS_LIST = void 0;
var models_1 = require("./models");
/**
 * 知识库状态列表数据
 */
exports.WIKI_STATUS_LIST = [
    {
        value: models_1.WikiStatus.private,
        label: '私有'
    },
    {
        value: models_1.WikiStatus.public,
        label: '公开'
    },
];
/**
 * 知识库成员角色列表数据
 */
exports.WIKI_USER_ROLES = [
    {
        value: 'admin',
        label: '管理员'
    },
    {
        value: 'normal',
        label: '成员'
    },
];
/**
 * 文档状态列表数据
 */
exports.DOCUMENT_STATUS = [
    {
        value: models_1.DocumentStatus.private,
        label: '私有'
    },
    {
        value: models_1.DocumentStatus.public,
        label: '公开'
    },
];
/**
 * 获取知识库状态对应文本
 * @param wiki 实例数据
 * @returns
 */
var getWikiStatusText = function (wiki) {
    return exports.WIKI_STATUS_LIST.find(function (t) { return t.value === wiki.status; }).label;
};
exports.getWikiStatusText = getWikiStatusText;
/**
 * 检查知识库是否公开
 * @param currentStatus wiki 实例数据的 status 字段
 * @returns
 */
var isPublicWiki = function (currentStatus) { return currentStatus === models_1.WikiStatus.public; };
exports.isPublicWiki = isPublicWiki;
/**
 * 检查文档是否公开
 * @param currentStatus document 实例数据的 status 字段
 * @returns
 */
var isPublicDocument = function (currentStatus) { return currentStatus === models_1.DocumentStatus.public; };
exports.isPublicDocument = isPublicDocument;
