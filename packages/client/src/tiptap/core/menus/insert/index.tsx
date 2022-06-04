import { IconPlus } from '@douyinfe/semi-icons';
import { Button, Dropdown, Popover } from '@douyinfe/semi-ui';
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
import { Tooltip } from 'components/tooltip';
import { useUser } from 'data/user';
import { createKeysLocalStorageLRUCache } from 'helpers/lru-cache';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Editor } from 'tiptap/core';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';

import { createCountdown } from '../countdown/service';

const insertMenuLRUCache = createKeysLocalStorageLRUCache('TIPTAP_INSERT_MENU', 3);

const COMMANDS = [
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
    action: (editor) => {
      editor.chain().focus().setEmptyImage({ width: '100%' }).run();
    },
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
    action: (editor) => {
      editor.chain().focus().setFlow({ width: '100%' }).run();
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
    action: (editor, user) => editor.chain().focus().setKatex({ defaultShowPicker: true, createUser: user.name }).run(),
  },
  {
    icon: <IconStatus />,
    label: '状态',
    action: (editor, user) =>
      editor.chain().focus().setStatus({ defaultShowPicker: true, createUser: user.name }).run(),
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
    action: (editor) => editor.chain().focus().setDocumentReference().run(),
  },
  {
    icon: <IconDocument />,
    label: '子文档',
    action: (editor) => editor.chain().focus().setDocumentChildren().run(),
  },
];

export const Insert: React.FC<{ editor: Editor }> = ({ editor }) => {
  const { user } = useUser();
  const [recentUsed, setRecentUsed] = useState([]);
  const isTitleActive = useActive(editor, Title.name);
  const [visible, toggleVisible] = useToggle(false);

  const renderedCommands = useMemo(
    () => (recentUsed.length ? [{ title: '最近使用' }, ...recentUsed, ...COMMANDS] : COMMANDS),
    [recentUsed]
  );

  const transformToCommands = useCallback((data: string[]) => {
    return data
      .map((label) => {
        return COMMANDS.find((command) => command.label && command.label === label);
      })
      .filter(Boolean);
  }, []);

  const runCommand = useCallback(
    (command) => {
      return () => {
        insertMenuLRUCache.put(command.label);
        setRecentUsed(transformToCommands(insertMenuLRUCache.get() as string[]));
        command.action(editor, user);
        toggleVisible(false);
      };
    },
    [editor, toggleVisible, transformToCommands, user]
  );

  useEffect(() => {
    if (!visible) return;
    insertMenuLRUCache.syncFromStorage();
    setRecentUsed(transformToCommands(insertMenuLRUCache.get() as string[]));
  }, [visible, transformToCommands]);

  return (
    <Dropdown
      zIndex={10000}
      trigger="click"
      position="bottomLeft"
      visible={visible}
      onVisibleChange={toggleVisible}
      style={{
        minWidth: 132,
        maxHeight: 'calc(90vh - 120px)',
        overflowY: 'auto',
      }}
      render={
        <Dropdown.Menu>
          {renderedCommands.map((command, index) => {
            return command.title ? (
              <Dropdown.Title key={'title' + index}>{command.title}</Dropdown.Title>
            ) : command.custom ? (
              command.custom(editor, runCommand)
            ) : (
              <Dropdown.Item key={index + '-' + command.label} onClick={runCommand(command)}>
                {command.icon}
                {command.label}
              </Dropdown.Item>
            );
          })}
        </Dropdown.Menu>
      }
    >
      <div>
        <Tooltip content="插入">
          <Button type="tertiary" theme="borderless" icon={<IconPlus />} disabled={isTitleActive} />
        </Tooltip>
      </div>
    </Dropdown>
  );
};
