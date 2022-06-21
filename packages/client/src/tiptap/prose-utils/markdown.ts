export const isMarkdown = (text: string): boolean => {
  // html
  const html = text.match(/<\/?[a-z][\s\S]*>/i);
  if (html && html.length) return true;

  // 无序列表
  if (/^[*|+|-]/.test(text)) return true;

  // 有序列表
  if (/^[0-9]+\)/.test(text)) return true;

  // image
  const image = text.match(/!\[(\s|.)?\]\((\s|.)?\)/);
  if (image && image.length) return true;

  // table
  const tables = text.match(/^\|(\S)*\|/gm);
  if (tables && tables.length) return true;

  // 自定义 container
  const conatiner = text.match(/^:::/gm);
  if (conatiner && conatiner.length > 1) return true;

  // code-ish
  const fences = text.match(/^```/gm);
  if (fences && fences.length > 1) return true;

  // link-ish
  if (text.match(/\[[^]+\]\(https?:\/\/\S+\)/gm)) return true;
  if (text.match(/\[[^]+\]\(\/\S+\)/gm)) return true;

  // heading-ish
  if (text.match(/^#{1,6}\s+\S+/gm)) return true;

  // list-ish
  const listItems = text.match(/^[\d-*].?\s\S+/gm);
  if (listItems && listItems.length > 1) return true;

  return false;
};

export const normalizeMarkdown = (text: string): string => {
  const CHECKBOX_REGEX = /^\s?(\[(X|\s|_|-)\]\s(.*)?)/gim;

  while (text.match(CHECKBOX_REGEX)) {
    text = text.replace(CHECKBOX_REGEX, (match) => `- ${match.trim()}`);
  }

  return text;
};
