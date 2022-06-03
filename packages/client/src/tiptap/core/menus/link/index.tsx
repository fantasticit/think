import { Button } from '@douyinfe/semi-ui';
import { IconLink } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';
import { Link as LinkExtension } from 'tiptap/core/extensions/link';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';

import { LinkBubbleMenu } from './bubble';
import { LinkSettingModal } from './modal';
import { createOrToggleLink } from './service';

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
