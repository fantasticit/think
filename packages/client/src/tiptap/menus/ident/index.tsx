import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconIndentLeft, IconIndentRight } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from '../../utils/is-active';

export const Ident: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Tooltip content="增加缩进">
        <Button
          onClick={() => {
            // @ts-ignore
            editor.chain().focus().indent().run();
          }}
          icon={<IconIndentRight />}
          theme={'borderless'}
          type="tertiary"
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip content="减少缩进">
        <Button
          onClick={() => {
            // @ts-ignore
            editor.chain().focus().outdent().run();
          }}
          icon={<IconIndentLeft />}
          theme={'borderless'}
          type="tertiary"
          disabled={isTitleActive(editor)}
        />
      </Tooltip>
    </>
  );
};
