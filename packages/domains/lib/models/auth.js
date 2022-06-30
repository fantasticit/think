"use strict";
var _a;
exports.__esModule = true;
exports.AuthEnumArray = exports.AuthEnumTextMap = exports.AuthEnum = void 0;
var AuthEnum;
(function (AuthEnum) {
    AuthEnum["creator"] = "creator";
    AuthEnum["admin"] = "admin";
    AuthEnum["member"] = "member";
    AuthEnum["noAccess"] = "noAccess";
})(AuthEnum = exports.AuthEnum || (exports.AuthEnum = {}));
exports.AuthEnumTextMap = (_a = {},
    _a[AuthEnum.creator] = '超级管理员',
    _a[AuthEnum.admin] = '管理员',
    _a[AuthEnum.member] = '成员',
    _a[AuthEnum.noAccess] = '无权限',
    _a);
exports.AuthEnumArray = Object.keys(exports.AuthEnumTextMap).map(function (value) { return ({
    label: exports.AuthEnumTextMap[value],
    value: value
}); });
