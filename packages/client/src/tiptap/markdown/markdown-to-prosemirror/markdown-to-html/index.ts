import { sanitize } from 'dompurify';
import markdownit from 'markdown-it';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import anchor from 'markdown-it-anchor';
import emoji from 'markdown-it-emoji';
import katex from './markdownKatex';
import tasklist from './markdownTaskList';
import splitMixedLists from './markedownSplitMixedList';
import markdownUnderline from './markdownUnderline';
import markdownBanner from './markdownBanner';
import { markdownItTable } from './markdownTable';
import { createMarkdownContainer } from './markdownItContainer';

const markdownAttachment = createMarkdownContainer('attachment');
const markdownStatus = createMarkdownContainer('status');
const markdownCountdown = createMarkdownContainer('countdown');
const markdownDocumentReference = createMarkdownContainer('documentReference');
const markdownDocumentChildren = createMarkdownContainer('documentChildren');
const markdownIframe = createMarkdownContainer('iframe');
const markdownMention = createMarkdownContainer('mention');
const markdownMind = createMarkdownContainer('mind');

const markdown = markdownit('commonmark')
  .enable('strikethrough')
  .use(sub)
  .use(sup)
  .use(anchor)
  .use(tasklist)
  .use(splitMixedLists)
  .use(markdownUnderline)
  .use(markdownItTable)
  .use(emoji)
  .use(katex)
  // 以下为自定义节点
  .use(markdownBanner)
  .use(markdownAttachment)
  .use(markdownCountdown)
  .use(markdownIframe)
  .use(markdownStatus)
  .use(markdownMention)
  .use(markdownMind)
  .use(markdownDocumentReference)
  .use(markdownDocumentChildren);

export const markdownToHTML = (rawMarkdown) => {
  return sanitize(markdown.render(rawMarkdown), {});
};
