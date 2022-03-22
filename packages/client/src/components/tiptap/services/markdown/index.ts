import markdownit from 'markdown-it';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import footnote from 'markdown-it-footnote';
import anchor from 'markdown-it-anchor';
import emoji from 'markdown-it-emoji';
import katex from '@traptitech/markdown-it-katex';
import tasklist from './markdownTaskList';
import splitMixedLists from './markedownSplitMixedList';
import markdownUnderline from './markdownUnderline';
import markdownBanner from './markdownBanner';
import { markdownItTable } from './markdownTable';

export const markdown = markdownit('commonmark')
  .enable('strikethrough')
  .use(sub)
  .use(sup)
  .use(footnote)
  .use(anchor)
  .use(tasklist)
  .use(splitMixedLists)
  .use(markdownUnderline)
  .use(markdownBanner)
  .use(markdownItTable)
  .use(emoji)
  .use(katex);

export * from './serializer';
