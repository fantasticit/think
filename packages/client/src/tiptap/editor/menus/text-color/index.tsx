import React, { useCallback } from 'react';
import { Editor } from 'tiptap/editor';
import { Button } from '@douyinfe/semi-ui';
import { IconFont } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { useActive } from 'tiptap/editor/hooks/use-active';
import { Title } from 'tiptap/core/extensions/title';
import { TextStyle } from 'tiptap/core/extensions/text-style';
import { useAttributes } from 'tiptap/editor/hooks/use-attributes';
import { ColorPicker } from 'tiptap/components/color-picker';

type Color = { color: string };

const FlexStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
} as React.CSSProperties;

export const TextColor: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isTextStyleActive = useActive(editor, TextStyle.name);
  const color = useAttributes<Color, Color['color']>(
    editor,
    'textStyle',
    { color: 'transparent' },
    (attrs) => attrs.color
  );

  const setColor = useCallback(
    (color) => {
      color ? editor.chain().focus().setColor(color).run() : editor.chain().focus().unsetColor().run();
    },
    [editor]
  );

  return (
    <ColorPicker onSetColor={setColor} disabled={isTitleActive}>
      <Tooltip content="文本色">
        <Button
          theme={isTextStyleActive ? 'light' : 'borderless'}
          type={'tertiary'}
          icon={
            <div style={FlexStyle}>
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
          disabled={isTitleActive}
        />
      </Tooltip>
    </ColorPicker>
  );
};
