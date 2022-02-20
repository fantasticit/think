export const buildUrl = (url) => {
  if (typeof window === 'undefined') return url;
  return `${window.location.origin}${url}`;
};
