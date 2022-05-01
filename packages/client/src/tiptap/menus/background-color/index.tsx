import React from 'react';
import { Editor } from '@tiptap/core';
import { Button } from '@douyinfe/semi-ui';
import { IconMark } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from 'tiptap/prose-utils';
import { ColorPicker } from '../_components/color-picker';

export const BackgroundColor: React.FC<{ editor: Editor }> = ({ editor }) => {
  const { backgroundColor } = editor.getAttributes('textStyle');

  return (
    <ColorPicker
      onSetColor={(color) => {
        color
          ? editor.chain().focus().setBackgroundColor(color).run()
          : editor.chain().focus().unsetBackgroundColor().run();
      }}
      disabled={isTitleActive(editor)}
    >
      <Tooltip content="背景色">
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
              <IconMark />
              <span style={{ backgroundColor, width: 12, height: 2 }}></span>
            </div>
          }
          disabled={isTitleActive(editor)}
        />
      </Tooltip>
    </ColorPicker>
  );
};
