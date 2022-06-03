import { IconMark } from '@douyinfe/semi-icons';
import { Button } from '@douyinfe/semi-ui';
import { ColorPicker } from 'components/color-picker';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';

const FlexStyle: React.CSSProperties = {
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'center',
};

export const BackgroundColor: React.FC<{ editor: Editor }> = ({ editor }) => {
  const backgroundColor = useAttributes(
    editor,
    'textStyle',
    { backgroundColor: null },
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
    <ColorPicker title="背景色" onSetColor={setBackgroundColor} disabled={isTitleActive}>
      <Tooltip content="背景色">
        <Button
          theme={backgroundColor ? 'light' : 'borderless'}
          type={'tertiary'}
          icon={
            <span style={FlexStyle}>
              <IconMark />
              <span style={{ backgroundColor, width: 12, height: 2 }}></span>
            </span>
          }
          disabled={isTitleActive}
        />
      </Tooltip>
    </ColorPicker>
  );
};
