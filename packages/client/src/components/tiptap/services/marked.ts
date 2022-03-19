import markdownit from 'markdown-it';
import sub from 'markdown-it-sub';
import sup from 'markdown-it-sup';
import footnote from 'markdown-it-footnote';
import anchor from 'markdown-it-anchor';
import tasklist from 'markdown-it-task-lists';
import katex from '@traptitech/markdown-it-katex';

export const marked = markdownit()
  .use(sub)
  .use(sup)
  .use(footnote)
  .use(anchor)
  .use(tasklist)
  .use(katex);
