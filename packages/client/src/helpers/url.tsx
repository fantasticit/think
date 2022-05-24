export const buildUrl = (url) => {
  if (typeof window === 'undefined') return url;
  return `${window.location.origin}${url}`;
};

export const getWikiShareURL = (wikiId) => {
  const url = '/share/wiki/' + wikiId;
  if (typeof window === 'undefined') return url;
  return window.location.origin + url;
};

export const getDocumentShareURL = (documentId) => {
  const url = '/share/document/' + documentId;
  if (typeof window === 'undefined') return url;
  return window.location.origin + url;
};
