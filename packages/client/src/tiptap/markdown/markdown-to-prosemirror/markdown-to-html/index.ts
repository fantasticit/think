import { sanitize } from 'dompurify';
import markdownit from 'markdown-it';
import anchor from 'markdown-it-anchor';
import emoji from 'markdown-it-emoji';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';

import markdownCallout from './markdownCallout';
import { createMarkdownContainer } from './markdownItContainer';
import katex from './markdownKatex';
import { markdownItTable } from './markdownTable';
import tasklist from './markdownTaskList';
import markdownUnderline from './markdownUnderline';
import splitMixedLists from './markedownSplitMixedList';

const markdownAttachment = createMarkdownContainer('attachment');
const markdownStatus = createMarkdownContainer('status');
const markdownCountdown = createMarkdownContainer('countdown');
const markdownDocumentReference = createMarkdownContainer('documentReference');
const markdownDocumentChildren = createMarkdownContainer('documentChildren');
const markdownIframe = createMarkdownContainer('iframe');
const markdownMention = createMarkdownContainer('mention');
const markdownMind = createMarkdownContainer('mind');
const markdownExcalidraw = createMarkdownContainer('excalidraw');
const markdownFlow = createMarkdownContainer('flow');
const markdownTableOfContents = createMarkdownContainer('tableOfContents');
const markdownTitle = createMarkdownContainer('title');

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
  .use(markdownCallout)
  .use(markdownAttachment)
  .use(markdownCountdown)
  .use(markdownIframe)
  .use(markdownStatus)
  .use(markdownMention)
  .use(markdownMind)
  .use(markdownExcalidraw)
  .use(markdownDocumentReference)
  .use(markdownDocumentChildren)
  .use(markdownFlow)
  .use(markdownTableOfContents)
  .use(markdownTitle);

export const markdownToHTML = (rawMarkdown) => {
  return sanitize(markdown.render(rawMarkdown), {});
};
