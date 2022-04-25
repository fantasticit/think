import { Editor } from '@tiptap/core';
import { Space } from '@douyinfe/semi-ui';
import { IconList, IconOrderedList } from '@douyinfe/semi-icons';
import {
  IconHeading1,
  IconHeading2,
  IconHeading3,
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
  IconCountdown,
  IconCallout,
} from 'components/icons';
import { createCountdown } from './countdown/service';
import { createOrToggleLink } from './link/service';

export const QUICK_INSERT_ITEMS = [
  {
    key: '标题1',
    label: (
      <Space>
        <IconHeading1 />
        标题1
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },

  {
    key: '标题2',
    label: (
      <Space>
        <IconHeading2 />
        标题2
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },

  {
    key: '标题1',
    label: (
      <Space>
        <IconHeading3 />
        标题3
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },

  {
    key: '无序列表',
    label: (
      <Space>
        <IconList />
        无序列表
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().toggleBulletList().run(),
  },

  {
    key: '有序列表',
    label: (
      <Space>
        <IconOrderedList />
        有序列表
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().toggleOrderedList().run(),
  },

  {
    key: '任务列表',
    label: (
      <Space>
        <IconTask />
        任务列表
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().toggleTaskList().run(),
  },

  {
    key: '链接',
    label: (
      <Space>
        <IconLink />
        链接
      </Space>
    ),
    command: (editor: Editor) => createOrToggleLink(editor),
  },

  {
    key: '引用',
    label: (
      <Space>
        <IconQuote />
        引用
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().toggleBlockquote().run(),
  },

  {
    key: '分割线',
    label: (
      <Space>
        <IconHorizontalRule />
        分割线
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().setHorizontalRule().run(),
  },

  {
    key: '表格',
    label: (
      <Space>
        <IconTable />
        表格
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },

  {
    key: '代码块',
    label: (
      <Space>
        <IconCodeBlock />
        代码块
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().toggleCodeBlock().run(),
  },

  {
    key: '图片',
    label: () => (
      <Space>
        <IconImage />
        图片
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().setEmptyImage().run(),
  },

  {
    key: '附件',
    label: () => (
      <Space>
        <IconAttachment />
        附件
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().setAttachment().run(),
  },

  {
    key: '倒计时',
    label: () => (
      <Space>
        <IconCountdown />
        倒计时
      </Space>
    ),
    command: (editor: Editor) => createCountdown(editor),
  },

  {
    key: '外链',
    label: (
      <Space>
        <IconLink />
        外链
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().setIframe({ url: '' }).run(),
  },

  {
    key: '思维导图',
    label: (
      <Space>
        <IconMind />
        思维导图
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().setMind().run(),
  },

  {
    key: '数学公式',
    label: (
      <Space>
        <IconMath />
        数学公式
      </Space>
    ),
    command: (editor: Editor) =>
      editor
        .chain()
        .focus()
        .setKatex({
          defaultShowPicker: true,
        })
        .run(),
  },

  {
    key: '状态',
    label: (
      <Space>
        <IconStatus />
        状态
      </Space>
    ),
    command: (editor: Editor) =>
      editor
        .chain()
        .focus()
        .setStatus({
          defaultShowPicker: true,
        })
        .run(),
  },

  {
    key: '高亮块',
    label: (
      <Space>
        <IconCallout />
        高亮块
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().setCallout().run(),
  },

  {
    key: '文档',
    label: (
      <Space>
        <IconDocument />
        文档
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().setDocumentReference().run(),
  },

  {
    key: '子文档',
    label: (
      <Space>
        <IconDocument />
        子文档
      </Space>
    ),
    command: (editor: Editor) => editor.chain().focus().setDocumentChildren().run(),
  },
];
