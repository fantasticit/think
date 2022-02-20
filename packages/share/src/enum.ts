import { IDocument, IWiki } from "./type";

export enum UserRole {
  normal = "normal",
  admin = "admin",
  superadmin = "superadmin",
}

export enum UserStatus {
  normal = "normal",
  locked = "locked",
}

export enum WikiStatus {
  private = "private",
  public = "public",
}

export enum WikiUserStatus {
  applying = "applying",
  inviting = "inviting",
  normal = "normal",
}

export enum WikiUserRole {
  normal = "normal",
  admin = "admin",
}

export enum DocumentStatus {
  private = "private",
  public = "public",
}

export enum CollectType {
  document = "document",
  wiki = "wiki",
}

export const WIKI_STATUS_LIST = [
  {
    value: WikiStatus.private,
    label: "私有",
  },
  {
    value: WikiStatus.public,
    label: "公开",
  },
];

export const WIKI_USER_ROLES = [
  {
    value: "admin",
    label: "管理员",
  },
  {
    value: "normal",
    label: "成员",
  },
];

export const DOCUMENT_STATUS = [
  {
    value: DocumentStatus.private,
    label: "私有",
  },
  {
    value: DocumentStatus.public,
    label: "公开",
  },
];

export const getWikiStatusText = (wiki: IWiki) => {
  return WIKI_STATUS_LIST.find((t) => t.value === wiki.status).label;
};

export const isPublicWiki = (currentStatus: IWiki["status"]) =>
  currentStatus === WikiStatus.public;

export const renderWikiUserRole = (role) => {
  return WIKI_USER_ROLES.find((d) => d.value === role).label;
};

export const getWikiShareURL = (wikiId) => {
  return window.location.host + "/share/wiki/" + wikiId;
};

export const getDocumentShareURL = (documentId) => {
  return window.location.host + "/share/document/" + documentId;
};

export const isPublicDocument = (currentStatus: IDocument["status"]) =>
  currentStatus === DocumentStatus.public;
