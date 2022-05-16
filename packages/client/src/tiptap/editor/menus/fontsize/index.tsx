import { Select } from '@douyinfe/semi-ui';
import React, { useCallback } from 'react';
import { Title } from 'tiptap/core/extensions/title';
import { Editor } from 'tiptap/editor';
import { useActive } from 'tiptap/editor/hooks/use-active';
import { useAttributes } from 'tiptap/editor/hooks/use-attributes';

export const FONT_SIZES = [12, 13, 14, 15, 16, 19, 22, 24, 29, 32, 40, 48];

export const FontSize: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const currentFontSize = useAttributes(editor, 'textStyle', { fontSize: '16px' }, (attrs) =>
    attrs.fontSize.replace('px', '')
  );

  const toggle = useCallback(
    (val) => {
      editor
        .chain()
        .focus()
        .setFontSize(val + 'px')
        .run();
    },
    [editor]
  );

  return (
    <Select disabled={isTitleActive} value={+currentFontSize} onChange={toggle} style={{ width: 80, marginRight: 10 }}>
      {FONT_SIZES.map((fontSize) => (
        <Select.Option key={fontSize} value={fontSize}>
          {fontSize}px
        </Select.Option>
      ))}
    </Select>
  );
};
