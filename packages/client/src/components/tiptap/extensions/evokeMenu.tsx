import { Node, findParentNode } from '@tiptap/core';
import { ReactRenderer } from '@tiptap/react';
import { Plugin, PluginKey } from 'prosemirror-state';
import { Decoration, DecorationSet } from 'prosemirror-view';
import Suggestion from '@tiptap/suggestion';
import tippy from 'tippy.js';
import { Space } from '@douyinfe/semi-ui';
import { IconList, IconOrderedList } from '@douyinfe/semi-icons';
import {
  IconLink,
  IconQuote,
  IconHorizontalRule,
  IconTask,
  IconDocument,
  IconMind,
  IconTable,
  IconImage,
  IconCodeBlock,
  IconStatus,
  IconInfo,
  IconAttachment,
  IconMath,
} from 'components/icons';
import { Upload } from 'components/upload';
import { MenuList } from '../components/menuList';
import { getImageOriginSize } from '../services/image';

export const EvokeMenuPluginKey = new PluginKey('evokeMenu');

const COMMANDS = [
  {
    key: '标题1',
    label: '标题1',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    key: '标题1',
    label: '标题2',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    key: '标题1',
    label: '标题3',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    key: '标题1',
    label: '标题4',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 4 }).run(),
  },
  {
    key: '标题1',
    label: '标题5',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 5 }).run(),
  },
  {
    key: '标题1',
    label: '标题6',
    command: (editor) => editor.chain().focus().toggleHeading({ level: 6 }).run(),
  },
  {
    key: '无序列表',
    label: (
      <Space>
        <IconList />
        无序列表
      </Space>
    ),
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    key: '有序列表',
    label: (
      <Space>
        <IconOrderedList />
        有序列表
      </Space>
    ),
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    key: '任务列表',
    label: (
      <Space>
        <IconTask />
        任务列表
      </Space>
    ),
    command: (editor) => editor.chain().focus().toggleTaskList().run(),
  },
  {
    key: '链接',
    label: (
      <Space>
        <IconLink />
        链接
      </Space>
    ),
    command: (editor) => editor.chain().focus().toggleLink().run(),
  },
  {
    key: '引用',
    label: (
      <Space>
        <IconQuote />
        引用
      </Space>
    ),
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    key: '分割线',
    label: (
      <Space>
        <IconHorizontalRule />
        分割线
      </Space>
    ),
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },
  {
    key: '表格',
    label: (
      <Space>
        <IconTable />
        表格
      </Space>
    ),
    command: (editor) =>
      editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  {
    key: '代码块',
    label: (
      <Space>
        <IconCodeBlock />
        代码块
      </Space>
    ),
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    key: '图片',
    label: (editor) => (
      <Space>
        <IconImage />
        <Upload
          accept="image/*"
          onOK={async (url, fileName) => {
            const { width, height } = await getImageOriginSize(url);
            console.log('upload', width, height);
            editor.chain().focus().setImage({ src: url, alt: fileName, width, height }).run();
          }}
        >
          {() => '图片'}
        </Upload>
      </Space>
    ),
    command: (editor) => {},
  },
  {
    key: '附件',
    label: (editor) => (
      <Space>
        <IconAttachment />
        <Upload
          onOK={(url, name) => {
            editor.chain().focus().setAttachment({ url, name }).run();
          }}
        >
          {() => '附件'}
        </Upload>
      </Space>
    ),
    command: (editor) => {},
  },
  {
    key: '外链',
    label: (
      <Space>
        <IconLink />
        外链
      </Space>
    ),
    command: (editor) => editor.chain().focus().insertIframe({ url: '' }).run(),
  },
  {
    key: '思维导图',
    label: (
      <Space>
        <IconMind />
        思维导图
      </Space>
    ),
    command: (editor) => editor.chain().focus().insertMind().run(),
  },
  {
    key: '数学公式',
    label: (
      <Space>
        <IconMath />
        数学公式
      </Space>
    ),
    command: (editor) => editor.chain().focus().setKatex().run(),
  },
  {
    key: '状态',
    label: (
      <Space>
        <IconStatus />
        状态
      </Space>
    ),
    command: (editor) => editor.chain().focus().setStatus().run(),
  },
  {
    key: '信息框',
    label: (
      <Space>
        <IconInfo />
        信息框
      </Space>
    ),
    command: (editor) => editor.chain().focus().setBanner({ type: 'info' }).run(),
  },
  {
    key: '文档',
    label: (
      <Space>
        <IconDocument />
        文档
      </Space>
    ),
    command: (editor) => editor.chain().focus().setDocumentReference().run(),
  },
  {
    key: '子文档',
    label: (
      <Space>
        <IconDocument />
        子文档
      </Space>
    ),
    command: (editor) => editor.chain().focus().setDocumentChildren().run(),
  },
];

export const EvokeMenu = Node.create({
  name: 'evokeMenu',

  addOptions() {
    return {
      HTMLAttributes: {},
      suggestion: {
        char: '/',
        pluginKey: EvokeMenuPluginKey,
        command: ({ editor, range, props }) => {
          const { state, dispatch } = editor.view;
          const $from = state.selection.$from;
          const tr = state.tr.deleteRange($from.start(), $from.pos);
          dispatch(tr);
          props?.command(editor);
          editor.view.focus();
        },
      },
    };
  },

  addProseMirrorPlugins() {
    const { editor } = this;

    return [
      Suggestion({
        editor: this.editor,
        ...this.options.suggestion,
      }),

      new Plugin({
        key: new PluginKey('evokeMenuPlaceholder'),
        props: {
          decorations: (state) => {
            if (!editor.isEditable) return;

            const parent = findParentNode((node) => node.type.name === 'paragraph')(
              state.selection
            );
            if (!parent) {
              return;
            }

            const decorations: Decoration[] = [];
            const isEmpty = parent && parent.node.content.size === 0;
            const isSlash = parent && parent.node.textContent === '/';
            const isTopLevel = state.selection.$from.depth === 1;

            if (isTopLevel) {
              if (isEmpty) {
                decorations.push(
                  Decoration.node(parent.pos, parent.pos + parent.node.nodeSize, {
                    'class': 'placeholder',
                    'data-placeholder': '输入 / 唤起更多',
                  })
                );
              }

              if (isSlash) {
                decorations.push(
                  Decoration.node(parent.pos, parent.pos + parent.node.nodeSize, {
                    'class': 'placeholder',
                    'data-placeholder': `  继续输入进行过滤`,
                  })
                );
              }

              return DecorationSet.create(state.doc, decorations);
            }
            return null;
          },
        },
      }),
    ];
  },
}).configure({
  suggestion: {
    items: ({ query }) => {
      return COMMANDS.filter((command) => command.key.startsWith(query));
    },
    render: () => {
      let component;
      let popup;
      let isEditable;

      return {
        onStart: (props) => {
          isEditable = props.editor.isEditable;
          if (!isEditable) return;

          component = new ReactRenderer(MenuList, {
            props,
            editor: props.editor,
          });

          popup = tippy('body', {
            getReferenceClientRect: props.clientRect,
            appendTo: () => document.body,
            content: component.element,
            showOnCreate: true,
            interactive: true,
            trigger: 'manual',
            placement: 'bottom-start',
          });
        },

        onUpdate(props) {
          if (!isEditable) return;

          component.updateProps(props);
          popup[0].setProps({
            getReferenceClientRect: props.clientRect,
          });
        },

        onKeyDown(props) {
          if (!isEditable) return;

          if (props.event.key === 'Escape') {
            popup[0].hide();
            return true;
          }
          return component.ref?.onKeyDown(props);
        },

        onExit(props) {
          if (!isEditable) return;

          popup[0].destroy();
          component.destroy();
        },
      };
    },
  },
});
