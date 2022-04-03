import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { IconLink } from 'components/icons';
import { isTitleActive } from '../../services/is-active';
import { createOrToggleLink } from './service';
import { LinkBubbleMenu } from './bubble';
import { LinkSettingModal } from './modal';

export const Link: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Tooltip content="插入链接">
        <Button
          theme={editor.isActive('link') ? 'light' : 'borderless'}
          type="tertiary"
          icon={<IconLink />}
          onClick={() => createOrToggleLink(editor)}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>
      <LinkBubbleMenu editor={editor} />
      <LinkSettingModal editor={editor} />
    </>
  );
};
