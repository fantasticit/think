"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isPublicDocument = exports.getDocumentShareURL = exports.getWikiShareURL = exports.renderWikiUserRole = exports.isPublicWiki = exports.getWikiStatusText = exports.DOCUMENT_STATUS = exports.WIKI_USER_ROLES = exports.WIKI_STATUS_LIST = exports.CollectType = exports.DocumentStatus = exports.WikiUserRole = exports.WikiUserStatus = exports.WikiStatus = exports.UserStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["normal"] = "normal";
    UserRole["admin"] = "admin";
    UserRole["superadmin"] = "superadmin";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var UserStatus;
(function (UserStatus) {
    UserStatus["normal"] = "normal";
    UserStatus["locked"] = "locked";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
var WikiStatus;
(function (WikiStatus) {
    WikiStatus["private"] = "private";
    WikiStatus["public"] = "public";
})(WikiStatus = exports.WikiStatus || (exports.WikiStatus = {}));
var WikiUserStatus;
(function (WikiUserStatus) {
    WikiUserStatus["applying"] = "applying";
    WikiUserStatus["inviting"] = "inviting";
    WikiUserStatus["normal"] = "normal";
})(WikiUserStatus = exports.WikiUserStatus || (exports.WikiUserStatus = {}));
var WikiUserRole;
(function (WikiUserRole) {
    WikiUserRole["normal"] = "normal";
    WikiUserRole["admin"] = "admin";
})(WikiUserRole = exports.WikiUserRole || (exports.WikiUserRole = {}));
var DocumentStatus;
(function (DocumentStatus) {
    DocumentStatus["private"] = "private";
    DocumentStatus["public"] = "public";
})(DocumentStatus = exports.DocumentStatus || (exports.DocumentStatus = {}));
var CollectType;
(function (CollectType) {
    CollectType["document"] = "document";
    CollectType["wiki"] = "wiki";
})(CollectType = exports.CollectType || (exports.CollectType = {}));
exports.WIKI_STATUS_LIST = [
    {
        value: WikiStatus.private,
        label: "私有",
    },
    {
        value: WikiStatus.public,
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
        value: DocumentStatus.private,
        label: "私有",
    },
    {
        value: DocumentStatus.public,
        label: "公开",
    },
];
const getWikiStatusText = (wiki) => {
    return exports.WIKI_STATUS_LIST.find((t) => t.value === wiki.status).label;
};
exports.getWikiStatusText = getWikiStatusText;
const isPublicWiki = (currentStatus) => currentStatus === WikiStatus.public;
exports.isPublicWiki = isPublicWiki;
const renderWikiUserRole = (role) => {
    return exports.WIKI_USER_ROLES.find((d) => d.value === role).label;
};
exports.renderWikiUserRole = renderWikiUserRole;
const getWikiShareURL = (wikiId) => {
    return window.location.host + "/share/wiki/" + wikiId;
};
exports.getWikiShareURL = getWikiShareURL;
const getDocumentShareURL = (documentId) => {
    return window.location.host + "/share/document/" + documentId;
};
exports.getDocumentShareURL = getDocumentShareURL;
const isPublicDocument = (currentStatus) => currentStatus === DocumentStatus.public;
exports.isPublicDocument = isPublicDocument;
//# sourceMappingURL=enum.js.map