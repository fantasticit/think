import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconFont } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from 'tiptap/prose-utils';
import { ColorPicker } from '../_components/color-picker';

export const TextColor: React.FC<{ editor: Editor }> = ({ editor }) => {
  const { color } = editor.getAttributes('textStyle');

  if (!editor) {
    return null;
  }

  return (
    <ColorPicker
      onSetColor={(color) => {
        color ? editor.chain().focus().setColor(color).run() : editor.chain().focus().unsetColor().run();
      }}
      disabled={isTitleActive(editor)}
    >
      <Tooltip content="文本色">
        <Button
          theme={editor.isActive('textStyle') ? 'light' : 'borderless'}
          type={'tertiary'}
          icon={
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <IconFont style={{ fontSize: '0.85em' }} />
              <span
                style={{
                  width: 12,
                  height: 2,
                  backgroundColor: color,
                }}
              ></span>
            </div>
          }
          disabled={isTitleActive(editor)}
        />
      </Tooltip>
    </ColorPicker>
  );
};
