"use strict";
exports.__esModule = true;
exports.buildMessageURL = void 0;
var buildMessageURL = function (type) {
    switch (type) {
        case 'toDocument':
            return function (_a) {
                var organizationId = _a.organizationId, wikiId = _a.wikiId, documentId = _a.documentId;
                return "/app/org/".concat(organizationId, "/wiki/").concat(wikiId, "/doc/").concat(documentId);
            };
        case 'toWiki':
            return function (_a) {
                var organizationId = _a.organizationId, wikiId = _a.wikiId;
                return "/app/org/".concat(organizationId, "/wiki/").concat(wikiId);
            };
        case 'toOrganization':
            return function (_a) {
                var organizationId = _a.organizationId;
                return "/app/org/".concat(organizationId);
            };
        default:
            throw new Error();
    }
};
exports.buildMessageURL = buildMessageURL;
