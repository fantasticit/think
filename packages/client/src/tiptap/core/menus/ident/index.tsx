import React, { useCallback } from 'react';

import { IconIndentLeft, IconIndentRight } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';

import { Editor } from 'tiptap/core';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';

import { Tooltip } from 'components/tooltip';

export const Ident: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);

  const indent = useCallback(() => {
    editor.chain().focus().indent().run();
  }, [editor]);

  const outdent = useCallback(() => {
    editor.chain().focus().outdent().run();
  }, [editor]);

  return (
    <>
      <Tooltip content="增加缩进">
        <Button
          onClick={indent}
          icon={<IconIndentRight />}
          theme={'borderless'}
          type="tertiary"
          disabled={isTitleActive}
        />
      </Tooltip>

      <Tooltip content="减少缩进">
        <Button
          onClick={outdent}
          icon={<IconIndentLeft />}
          theme={'borderless'}
          type="tertiary"
          disabled={isTitleActive}
        />
      </Tooltip>
    </>
  );
};
