"use strict";
exports.__esModule = true;
exports.UserStatus = exports.UserRole = void 0;
/**
 * 用户角色枚举
 */
var UserRole;
(function (UserRole) {
    UserRole["normal"] = "normal";
    UserRole["admin"] = "admin";
    UserRole["superadmin"] = "superadmin";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
/**
 * 用户状态枚举
 */
var UserStatus;
(function (UserStatus) {
    UserStatus["normal"] = "normal";
    UserStatus["locked"] = "locked";
})(UserStatus = exports.UserStatus || (exports.UserStatus = {}));
