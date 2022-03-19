import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { lowlight } from 'lowlight/lib/all';
import { CodeBlockWrapper } from '../components/codeBlock';

const extractLanguage = (element) => element.getAttribute('lang');

export const CodeBlock = CodeBlockLowlight.extend({
  isolating: true,

  addAttributes() {
    return {
      language: {
        default: null,
        parseHTML: (element) => extractLanguage(element),
      },
      class: {
        default: 'code highlight',
      },
    };
  },
  renderHTML({ HTMLAttributes }) {
    return [
      'pre',
      {
        ...HTMLAttributes,
        class: `content-editor-code-block ${HTMLAttributes.class}`,
      },
      ['code', {}, 0],
    ];
  },
  addNodeView() {
    return ReactNodeViewRenderer(CodeBlockWrapper);
  },
}).configure({
  lowlight,
});
