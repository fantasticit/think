import React from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconFont, IconMark } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from '../services/is-active';
import { ColorPicker } from './color-picker';

export const ColorMenu: React.FC<{ editor: any }> = ({ editor }) => {
  const { color, backgroundColor } = editor.getAttributes('textStyle');

  if (!editor) {
    return null;
  }

  return (
    <>
      <ColorPicker
        onSetColor={(color) => {
          editor.chain().focus().setColor(color).run();
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

      <ColorPicker
        onSetColor={(color) => {
          editor.chain().focus().setBackgroundColor(color).run();
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
    </>
  );
};
