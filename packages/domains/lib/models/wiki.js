"use strict";
exports.__esModule = true;
exports.WikiUserRole = exports.WikiUserStatus = exports.WikiStatus = void 0;
/**
 * 知识库状态枚举
 */
var WikiStatus;
(function (WikiStatus) {
    WikiStatus["private"] = "private";
    WikiStatus["public"] = "public";
})(WikiStatus = exports.WikiStatus || (exports.WikiStatus = {}));
/**
 * 知识库成员状态枚举
 */
var WikiUserStatus;
(function (WikiUserStatus) {
    WikiUserStatus["applying"] = "applying";
    WikiUserStatus["inviting"] = "inviting";
    WikiUserStatus["normal"] = "normal";
})(WikiUserStatus = exports.WikiUserStatus || (exports.WikiUserStatus = {}));
/**
 * 知识库成员角色枚举
 */
var WikiUserRole;
(function (WikiUserRole) {
    WikiUserRole["normal"] = "normal";
    WikiUserRole["admin"] = "admin";
})(WikiUserRole = exports.WikiUserRole || (exports.WikiUserRole = {}));
