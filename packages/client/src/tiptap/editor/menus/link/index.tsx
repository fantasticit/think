import React, { useCallback } from 'react';
import { Editor } from 'tiptap/editor';
import { Button } from '@douyinfe/semi-ui';
import { Tooltip } from 'components/tooltip';
import { IconLink } from 'components/icons';
import { useActive } from 'tiptap/editor/hooks/use-active';
import { Title } from 'tiptap/core/extensions/title';
import { Link as LinkExtension } from 'tiptap/core/extensions/link';
import { createOrToggleLink } from './service';
import { LinkBubbleMenu } from './bubble';
import { LinkSettingModal } from './modal';

export const Link: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isLinkActive = useActive(editor, LinkExtension.name);

  const callLinkService = useCallback(() => createOrToggleLink(editor), [editor]);

  return (
    <>
      <Tooltip content="插入链接">
        <Button
          theme={isLinkActive ? 'light' : 'borderless'}
          type="tertiary"
          icon={<IconLink />}
          onClick={callLinkService}
          disabled={isTitleActive}
        />
      </Tooltip>
      <LinkBubbleMenu editor={editor} />
      <LinkSettingModal editor={editor} />
    </>
  );
};
