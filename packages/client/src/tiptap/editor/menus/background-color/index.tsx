import React, { useCallback } from 'react';
import { Editor } from 'tiptap/editor';
import { Button } from '@douyinfe/semi-ui';
import { IconMark } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useAttributes } from 'tiptap/editor/hooks/use-attributes';
import { useActive } from 'tiptap/editor/hooks/use-active';
import { Title } from 'tiptap/core/extensions/title';
import { ColorPicker } from 'tiptap/components/color-picker';

const FlexStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export const BackgroundColor: React.FC<{ editor: Editor }> = ({ editor }) => {
  const backgroundColor = useAttributes(
    editor,
    'textStyle',
    { backgroundColor: 'transparent' },
    (attrs) => attrs.backgroundColor
  );
  const isTitleActive = useActive(editor, Title.name);

  const setBackgroundColor = useCallback(
    (color) => {
      color
        ? editor.chain().focus().setBackgroundColor(color).run()
        : editor.chain().focus().unsetBackgroundColor().run();
    },
    [editor]
  );

  return (
    <ColorPicker onSetColor={setBackgroundColor} disabled={isTitleActive}>
      <Tooltip content="背景色">
        <Button
          theme={editor.isActive('textStyle') ? 'light' : 'borderless'}
          type={'tertiary'}
          icon={
            <div style={FlexStyle}>
              <IconMark />
              <span style={{ backgroundColor, width: 12, height: 2 }}></span>
            </div>
          }
          disabled={isTitleActive}
        />
      </Tooltip>
    </ColorPicker>
  );
};
