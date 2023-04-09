import React, { useCallback } from 'react';

import { Button, Dropdown, Tooltip } from '@douyinfe/semi-ui';

import { Editor } from 'tiptap/core';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';

import { IconLineHeight } from 'components/icons';

export const LINE_HEIGHT = [null, 1, 1.15, 1.5, 2, 2.5, 3];

export const LineHeight: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const currentValue = useAttributes(editor, 'textStyle', { lineHeight: null }, (attrs) => {
    if (!attrs || !attrs.lineHeight) return null;

    const matches = attrs.lineHeight.match(/\d+/);

    if (!matches || !matches[0]) return 16;
    return matches[0];
  });

  const toggle = useCallback(
    (val) => {
      if (val) {
        editor.chain().focus().setLineHeight(val).run();
      } else {
        editor.chain().focus().unsetLineHeight().run();
      }
    },
    [editor]
  );

  return (
    <Dropdown
      content={LINE_HEIGHT.map((val) => (
        <Dropdown.Item key={val} onClick={() => toggle(val)}>
          {val || '默认'}
        </Dropdown.Item>
      ))}
    >
      <span>
        <Tooltip content="行高">
          <Button icon={<IconLineHeight />} theme={'borderless'} type="tertiary" disabled={isTitleActive} />
        </Tooltip>
      </span>
    </Dropdown>
  );
};
