import markdownit from 'markdown-it';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import footnote from 'markdown-it-footnote';
import anchor from 'markdown-it-anchor';
import tasklist from 'markdown-it-task-lists';
import emoji from 'markdown-it-emoji';
import katex from '@traptitech/markdown-it-katex';
import splitMixedLists from './markedownSplitMixedList';
import markdownUnderline from './markdownUnderline';
import markdownBanner from './markdownBanner';

export const markdown = markdownit({
  html: true,
  linkify: true,
  typographer: true,
})
  .enable('strikethrough')
  .use(sub)
  .use(sup)
  .use(footnote)
  .use(anchor)
  .use(tasklist, { enable: true })
  .use(splitMixedLists)
  .use(markdownUnderline)
  .use(markdownBanner)
  .use(emoji)
  .use(katex);

export * from './serializer';
