import { Dropdown, Popover } from '@douyinfe/semi-ui';
import { IUser } from '@think/domains';
import { GridSelect } from 'components/grid-select';
import {
  IconAttachment,
  IconCallout,
  IconCodeBlock,
  IconCountdown,
  IconDocument,
  IconFlow,
  IconImage,
  IconLink,
  IconMath,
  IconMind,
  IconStatus,
  IconTable,
  IconTableOfContents,
} from 'components/icons';
import { createKeysLocalStorageLRUCache } from 'helpers/lru-cache';
import { Editor } from 'tiptap/core';

import { createCountdown } from './countdown/service';

export type ITitle = {
  title: string;
};

type IBaseCommand = {
  icon: React.ReactNode;
  label: string;
  user?: IUser;
};

type IAction = (editor: Editor, user?: IUser) => void;

export type ILabelRenderCommand = IBaseCommand & {
  action: IAction;
};

type ICustomRenderCommand = IBaseCommand & {
  custom: (editor: Editor, runCommand: (arg: { label: string; action: IAction }) => any) => React.ReactNode;
};

export type ICommand = ITitle | ILabelRenderCommand | ICustomRenderCommand;

export const insertMenuLRUCache = createKeysLocalStorageLRUCache('TIPTAP_INSERT_MENU', 3);

export const COMMANDS: ICommand[] = [
  {
    title: '通用',
  },
  {
    icon: <IconTableOfContents />,
    label: '目录',
    action: (editor) => editor.chain().focus().setTableOfContents().run(),
  },
  {
    icon: <IconTable />,
    label: '表格',
    custom: (editor, runCommand) => (
      <Popover
        key="table"
        showArrow
        position="rightTop"
        zIndex={10000}
        content={
          <div style={{ padding: 0 }}>
            <GridSelect
              onSelect={({ rows, cols }) => {
                return runCommand({
                  label: '表格',
                  action: () => editor.chain().focus().insertTable({ rows, cols, withHeaderRow: true }).run(),
                })();
              }}
            />
          </div>
        }
      >
        <Dropdown.Item>
          <IconTable />
          表格
        </Dropdown.Item>
      </Popover>
    ),
  },
  {
    icon: <IconCodeBlock />,
    label: '代码块',
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    icon: <IconImage />,
    label: '图片',
    action: (editor) => editor.chain().focus().setEmptyImage({ width: '100%' }).run(),
  },
  {
    icon: <IconAttachment />,
    label: '附件',
    action: (editor) => editor.chain().focus().setAttachment().run(),
  },
  {
    icon: <IconCountdown />,
    label: '倒计时',
    action: (editor) => createCountdown(editor),
  },
  {
    icon: <IconLink />,
    label: '外链',
    action: (editor) => editor.chain().focus().setIframe({ url: '' }).run(),
  },
  {
    title: '卡片',
  },
  {
    icon: <IconFlow />,
    label: '流程图',
    action: (editor, user) => {
      editor.chain().focus().setFlow({ width: '100%', defaultShowPicker: true, createUser: user.id }).run();
    },
  },
  {
    icon: <IconMind />,
    label: '思维导图',
    action: (editor) => {
      editor.chain().focus().setMind({ width: '100%' }).run();
    },
  },
  {
    icon: <IconMath />,
    label: '数学公式',
    action: (editor, user) => editor.chain().focus().setKatex({ defaultShowPicker: true, createUser: user.id }).run(),
  },
  {
    icon: <IconStatus />,
    label: '状态',
    action: (editor, user) => editor.chain().focus().setStatus({ defaultShowPicker: true, createUser: user.id }).run(),
  },
  {
    icon: <IconCallout />,
    label: '高亮块',
    action: (editor) => editor.chain().focus().setCallout().run(),
  },
  {
    title: '内容引用',
  },
  {
    icon: <IconDocument />,
    label: '文档',
    action: (editor, user) =>
      editor.chain().focus().setDocumentReference({ defaultShowPicker: true, createUser: user.id }).run(),
  },
  {
    icon: <IconDocument />,
    label: '子文档',
    action: (editor) => editor.chain().focus().setDocumentChildren().run(),
  },
];

export const QUICK_INSERT_COMMANDS = [
  ...COMMANDS.slice(0, 1),
  {
    icon: <IconTable />,
    label: '表格',
    action: (editor: Editor) => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(),
  },
  ...COMMANDS.slice(3),
];

export const transformToCommands = (data: string[]) => {
  return data
    .map((label) => {
      return COMMANDS.find((command) => {
        if ('title' in command) {
          return false;
        }

        return command.label === label;
      });
    })
    .filter(Boolean);
};
