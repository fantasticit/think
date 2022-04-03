import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { IconTask } from 'components/icons';
import { isTitleActive } from '../../services/is-active';

export const TaskList: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <Tooltip content="任务列表">
      <Button
        theme={editor.isActive('taskList') ? 'light' : 'borderless'}
        type="tertiary"
        icon={<IconTask />}
        onClick={() => editor.chain().focus().toggleTaskList().run()}
        disabled={isTitleActive(editor)}
      />
    </Tooltip>
  );
};
