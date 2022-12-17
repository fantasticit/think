import { Select } from '@douyinfe/semi-ui';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';

export const Fonts = [
  'Arial',
  'Arial Black',
  'Georgia',
  'Impact',
  'Tahoma',
  'Times New Roman',
  'Verdana',
  'Courier New',
  'Lucida Console',
  'Monaco',
  'monospace',
];

export const FontFamily: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const currentFontFamily = useAttributes(editor, 'textStyle', { fontFamily: '' }, (attrs) => attrs.fontFamily);

  const toggle = useCallback(
    (val) => {
      editor.chain().focus().setFontFamily(val).run();
    },
    [editor]
  );

  return (
    <Select
      disabled={isTitleActive}
      placeholder="字体"
      value={currentFontFamily}
      onChange={toggle}
      style={{ width: 80, marginRight: 10 }}
    >
      {Fonts.map((font) => (
        <Select.Option key={font} value={font}>
          {font}
        </Select.Option>
      ))}
    </Select>
  );
};
