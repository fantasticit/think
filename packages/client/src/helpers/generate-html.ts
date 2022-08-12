import { generateHTML } from '@tiptap/core';
import HtmlDiff from 'htmldiff-js';
import { CollaborationKit } from 'tiptap/editor';

const json2html = (json) => generateHTML(json, CollaborationKit);
export const generateDiffHtml = (selected, other) => {
  const selectedHtml = json2html(selected);
  const otherHtml = json2html(other);
  let diffHtml = HtmlDiff.execute(selectedHtml, otherHtml);
  diffHtml = diffHtml.replace(/<iframe\s*[^>]*>(.*?)<\/iframe>/gi, '');
  return diffHtml;
};
