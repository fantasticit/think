import { htmlToPromsemirror } from './html-to-prosemirror';
import { markdownToHTML } from './markdown-to-html';
export { prosemirrorToMarkdown } from './prosemirror-to-markdown';
export * from './helpers';
export * from './markdown-source-map';

// 将 markdown 字符串转换为 ProseMirror JSONDocument
export const markdownToProsemirror = ({ schema, content, hasTitle }) => {
  const html = markdownToHTML(content);

  if (!html) return null;

  const parser = new DOMParser();
  const { body } = parser.parseFromString(html, 'text/html');
  body.append(document.createComment(content));
  const node = htmlToPromsemirror(body, !hasTitle);

  return node;
};
