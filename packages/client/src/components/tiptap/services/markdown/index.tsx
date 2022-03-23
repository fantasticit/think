import { htmlToPromsemirror } from './htmlToProsemirror';
import { markdownToHTML } from './markdownToHTML';
export { prosemirrorToMarkdown } from './prosemirrorToMarkdown';
export * from './helpers';
export * from './markdownSourceMap';

// 将 markdown 字符串转换为 ProseMirror JSONDocument
export const markdownToProsemirror = ({ schema, content, hasTitle }) => {
  const html = markdownToHTML(content);

  if (!html) return null;

  const parser = new DOMParser();
  const { body } = parser.parseFromString(html, 'text/html');
  body.append(document.createComment(content));
  return htmlToPromsemirror(body, !hasTitle);
};
