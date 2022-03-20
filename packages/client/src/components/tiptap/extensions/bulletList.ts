import { BulletList as BuiltInBulletList } from '@tiptap/extension-bullet-list';
import { getMarkdownSource } from '../services/markdown/markdownSourceMap';
import { listInputRule } from '../services/listInputRule';

export const BulletList = BuiltInBulletList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),

      bullet: {
        default: '*',
        parseHTML(element) {
          const bullet = getMarkdownSource(element)?.charAt(0);

          return '*+-'.includes(bullet) ? bullet : '*';
        },
      },
    };
  },

  addInputRules() {
    return [listInputRule(/^\s*([-+*])\s([^\s[])$/, this.type)];
  },
});
