"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPublicDocument = exports.getWikiUserRoleText = exports.isPublicWiki = exports.getWikiStatusText = exports.DOCUMENT_STATUS = exports.WIKI_USER_ROLES = exports.WIKI_STATUS_LIST = void 0;
const models_1 = require("./models");
exports.WIKI_STATUS_LIST = [
    {
        value: models_1.WikiStatus.private,
        label: "私有",
    },
    {
        value: models_1.WikiStatus.public,
        label: "公开",
    },
];
exports.WIKI_USER_ROLES = [
    {
        value: "admin",
        label: "管理员",
    },
    {
        value: "normal",
        label: "成员",
    },
];
exports.DOCUMENT_STATUS = [
    {
        value: models_1.DocumentStatus.private,
        label: "私有",
    },
    {
        value: models_1.DocumentStatus.public,
        label: "公开",
    },
];
const getWikiStatusText = (wiki) => {
    return exports.WIKI_STATUS_LIST.find((t) => t.value === wiki.status).label;
};
exports.getWikiStatusText = getWikiStatusText;
const isPublicWiki = (currentStatus) => currentStatus === models_1.WikiStatus.public;
exports.isPublicWiki = isPublicWiki;
const getWikiUserRoleText = (role) => {
    return exports.WIKI_USER_ROLES.find((d) => d.value === role).label;
};
exports.getWikiUserRoleText = getWikiUserRoleText;
const isPublicDocument = (currentStatus) => currentStatus === models_1.DocumentStatus.public;
exports.isPublicDocument = isPublicDocument;
//# sourceMappingURL=util.js.map