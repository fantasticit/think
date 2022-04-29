import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Editor } from '@tiptap/core';
import { Button, Dropdown, Popover } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import {
  IconDocument,
  IconMind,
  IconTable,
  IconImage,
  IconCodeBlock,
  IconLink,
  IconStatus,
  IconAttachment,
  IconMath,
  IconCountdown,
  IconCallout,
} from 'components/icons';
import { GridSelect } from 'components/grid-select';
import { useToggle } from 'hooks/use-toggle';
import { useUser } from 'data/user';
import { createKeysLocalStorageLRUCache } from 'helpers/lru-cache';
import { isTitleActive, getEditorContainerDOMSize } from 'tiptap/prose-utils';
import { createCountdown } from '../countdown/service';

const insertMenuLRUCache = createKeysLocalStorageLRUCache('TIPTAP_INSERT_MENU', 3);

const COMMANDS = [
  {
    title: '通用',
  },
  {
    icon: <IconTable />,
    label: '表格',
    custom: (editor, runCommand) => (
      <Popover
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
    action: (editor) => editor.chain().focus().setEmptyImage().run(),
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
    icon: <IconMind />,
    label: '思维导图',
    action: (editor) => {
      const { width } = getEditorContainerDOMSize(editor);
      editor.chain().focus().setMind({ width }).run();
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
    [editor, toggleVisible]
  );

  useEffect(() => {
    if (!visible) return;
    insertMenuLRUCache.syncFromStorage();
    setRecentUsed(transformToCommands(insertMenuLRUCache.get() as string[]));
  }, [visible]);

  if (!editor) {
    return null;
  }

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
          {renderedCommands.map((command) => {
            return command.title ? (
              <Dropdown.Title>{command.title}</Dropdown.Title>
            ) : command.custom ? (
              command.custom(editor, runCommand)
            ) : (
              <Dropdown.Item onClick={runCommand(command)}>
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
          <Button type="tertiary" theme="borderless" icon={<IconPlus />} disabled={isTitleActive(editor)} />
        </Tooltip>
      </div>
    </Dropdown>
  );
};
