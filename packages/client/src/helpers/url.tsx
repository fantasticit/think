export const buildUrl = (url) => {
  if (typeof window === 'undefined') return url;
  return `${window.location.origin}${url}`;
};

export const getWikiShareURL = (wikiId) => {
  return window.location.origin + '/share/wiki/' + wikiId;
};

export const getDocumentShareURL = (documentId) => {
  return window.location.origin + '/share/document/' + documentId;
};
