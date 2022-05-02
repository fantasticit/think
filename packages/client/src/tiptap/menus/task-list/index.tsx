import React, { useCallback } from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { IconTask } from 'components/icons';
import { useActive } from 'tiptap/hooks/use-active';
import { Title } from 'tiptap/extensions/title';
import { TaskList as TaskListExtension } from 'tiptap/extensions/task-list';

export const TaskList: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isTaskListActive = useActive(editor, TaskListExtension.name);

  const toggleTaskList = useCallback(() => editor.chain().focus().toggleTaskList().run(), [editor]);

  return (
    <Tooltip content="任务列表">
      <Button
        theme={isTaskListActive ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconTask />}
        onClick={toggleTaskList}
        disabled={isTitleActive}
      />
    </Tooltip>
  );
};
