import { Extension } from '@tiptap/core';
import { Fragment } from 'prosemirror-model';
import { Plugin, PluginKey } from 'prosemirror-state';
import { EXTENSION_PRIORITY_HIGHEST } from 'tiptap/core/constants';
import { copyNode } from 'tiptap/prose-utils';

const isPureText = (content): boolean => {
  if (!content) return false;

  if (Array.isArray(content)) {
    if (content.length > 1) return false;
    return isPureText(content[0]);
  }

  const child = content['content'];
  if (child) {
    return isPureText(child);
  }

  return content['type'] === 'text';
};

interface IClipboardOptions {
  /**
   * 将 prosemirror 转换为 markdown
   */
  prosemirrorToMarkdown: (arg: { content: Fragment }) => string;
}

export const Clipboard = Extension.create<IClipboardOptions>({
  name: 'clipboard',
  priority: EXTENSION_PRIORITY_HIGHEST,

  addOptions() {
    return {
      prosemirrorToMarkdown: (arg) => String(arg.content),
    };
  },

  addProseMirrorPlugins() {
    const extensionThis = this;

    return [
      new Plugin({
        key: new PluginKey('clipboard'),
        props: {
          handleKeyDown(view, event) {
            /**
             * Command + C
             * Ctrl + C
             */
            if ((event.ctrlKey || event.metaKey) && event.keyCode == 67) {
              const { state } = view;
              // @ts-ignore
              const currentNode = state.selection.node;

              if (currentNode) {
                event.preventDefault();
                copyNode(currentNode, extensionThis.editor);
                return true;
              }
            }

            return false;
          },
          // clipboardTextSerializer: (slice) => {
          //   const json = slice.content.toJSON();
          //   const isSelectAll = slice.openStart === slice.openEnd && slice.openEnd === 0;

          //   if (Array.isArray(json) && !isSelectAll) {
          //     const type = json[0].type;

          //     // 列表项返回文字内容
          //     if (['bulletList', 'orderedList', 'taskList'].includes(type)) {
          //       return slice.content.textBetween(0, slice.content.size, '\n\n');
          //     }
          //   }

          //   if (typeof json === 'object' || isSelectAll) {
          //     return extensionThis.options.prosemirrorToMarkdown({
          //       content: slice.content,
          //     });
          //   }

          //   const isText = isPureText(json) && !isSelectAll;

          //   if (isText) {
          //     return slice.content.textBetween(0, slice.content.size, '\n\n');
          //   }
          //   const doc = slice.content;

          //   if (!doc) {
          //     return '';
          //   }

          //   const content = extensionThis.options.prosemirrorToMarkdown({
          //     content: doc,
          //   });
          //   return content;
          // },
        },
      }),
    ];
  },
});
