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

const markdown = markdownit('commonmark')
  .enable('strikethrough')
  .use(sub)
  .use(sup)
  .use(anchor)
  .use(tasklist)
  .use(splitMixedLists)
  .use(markdownUnderline)
  .use(markdownBanner)
  .use(markdownItTable)
  .use(emoji)
  .use(katex);

export const markdownToHTML = (rawMarkdown) => {
  return sanitize(markdown.render(rawMarkdown), {});
};
