import { htmlToProsemirror } from './html-to-prosemirror';
import { markdownToHTML } from './markdown-to-html';

/**
 * markdown-it 渲染出的 HTML 中 img 不符合格式要求
 * Input
 *  <p><img alt="" src="http://wipi.oss-cn-shanghai.aliyuncs.com/2022-03-30/53MWL5S22KFJ397ZNJ36N6/image.png"></p>
 *  <p class="contains-task-list"><img alt="" src="http://wipi.oss-cn-shanghai.aliyuncs.com/2022-03-30/53MWL5S22KFJ397ZNJ36N6/image.png"></p>
 * Output:
 *  <img alt="" src="http://wipi.oss-cn-shanghai.aliyuncs.com/2022-03-30/53MWL5S22KFJ397ZNJ36N6/image.png">
 *
 * @param html
 * @returns
 */
export const extractImage = (html) => {
  let matches = [];

  // eslint-disable-next-line no-useless-escape
  while ((matches = html.match(/\<p.*?\>\<img(.|\s)*?\>\<\/p\>/g))) {
    const target = matches[0].match(/<img.*?>/)[0];
    html = html.replace(matches[0], target);
  }

  return html;
};

// 将 markdown 字符串转换为 ProseMirror JSONDocument
export const markdownToProsemirror = ({ editor, schema, content, needTitle, defaultTitle = '' }) => {
  const html = markdownToHTML(content);

  if (!html) return null;

  const parser = new DOMParser();
  const { body } = parser.parseFromString(extractImage(html), 'text/html');
  body.append(document.createComment(content));
  const node = htmlToProsemirror(editor, body, needTitle, defaultTitle);

  return node;
};

export { markdownToHTML };
