import React, { useCallback } from 'react';
import { Editor } from 'tiptap/editor';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { IconTask } from 'components/icons';
import { useActive } from 'tiptap/editor/hooks/use-active';
import { Title } from 'tiptap/core/extensions/title';
import { TaskList as TaskListExtension } from 'tiptap/core/extensions/task-list';

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
