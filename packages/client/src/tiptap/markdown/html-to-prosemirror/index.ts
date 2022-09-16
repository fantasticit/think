import { extractImage } from '../markdown-to-prosemirror';
import { htmlToProsemirror as mdHTMLToProsemirror } from '../markdown-to-prosemirror/html-to-prosemirror';

/**
 * 将 HTML 转换成 prosemirror node
 * @param schema
 * @param html
 * @param needTitle 是否需要一个标题
 * @param defaultTitle 优先作为文档标题，否则默认读取一个 heading 或者 paragraph 的文字内容
 * @returns
 */
export const htmlToProsemirror = ({ editor, schema, html, needTitle, defaultTitle = '' }) => {
  const parser = new DOMParser();
  const { body } = parser.parseFromString(extractImage(html), 'text/html');
  body.append(document.createComment(html));
  const doc = mdHTMLToProsemirror(editor, body, needTitle, defaultTitle);
  return doc;
};
