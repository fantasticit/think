"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDocumentService = void 0;
class IDocumentService {
    constructor() {
        this.createLoading = false;
        this.createError = null;
        this.documentsDetail = new Map();
        this.getDocumentDetailLoading = false;
        this.getDocumentDetailError = null;
        this.updateDocumentLoading = false;
        this.updateDocumentError = null;
        this.deleteDocumentLoading = false;
        this.deleteDocumentError = null;
        this.documentsChildren = new Map();
        this.getDocumentChildrenLoading = false;
        this.getDocumentChildrenError = null;
        this.publicDocumentsChildren = new Map();
        this.getPublicDocumentChildrenLoading = false;
        this.getPublicDocumentChildrenError = null;
        this.shareLoading = false;
        this.shareError = null;
        this.documentsUsers = new Map();
        this.getDocumentUsersLoading = false;
        this.getDocumentUsersError = null;
        this.addDocumentUserLoading = false;
        this.addDocumentUserError = null;
        this.updateDocumentUserLoading = false;
        this.updateDocumentUserError = null;
        this.deleteDocumentUserLoading = false;
        this.deleteDocumentUserError = null;
        this.recentlyViewedDocuments = [];
        this.getRecentlyViewedDocumentsLoading = false;
        this.getRecentlyViewedDocumentsError = null;
        this.publicDocumentsDetail = new Map();
        this.getPublicDocumentDetailLoading = false;
        this.getPublicDocumentDetailError = null;
    }
}
exports.IDocumentService = IDocumentService;
//# sourceMappingURL=IDocumentService.js.map