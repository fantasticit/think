import { IconAlignCenter, IconAlignJustify, IconAlignLeft, IconAlignRight } from '@douyinfe/semi-icons';
import { Button, Dropdown, Tooltip } from '@douyinfe/semi-ui';
import React, { useCallback, useMemo } from 'react';
import { Editor } from 'tiptap/core';
import { Title } from 'tiptap/core/extensions/title';
import { useActive } from 'tiptap/core/hooks/use-active';

export const Align: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isAlignCenter = useActive(editor, { textAlign: 'center' });
  const isAlignRight = useActive(editor, { textAlign: 'right' });
  const isAlignJustify = useActive(editor, { textAlign: 'justify' });

  const current = useMemo(() => {
    if (isAlignCenter) {
      return <IconAlignCenter />;
    }
    if (isAlignRight) {
      return <IconAlignRight />;
    }
    if (isAlignJustify) {
      return <IconAlignJustify />;
    }
    return <IconAlignLeft />;
  }, [isAlignCenter, isAlignRight, isAlignJustify]);

  const toggle = useCallback(
    (align) => {
      return () => editor.chain().focus().setTextAlign(align).run();
    },
    [editor]
  );

  return (
    <Dropdown
      trigger="click"
      render={
        <>
          <Tooltip content="左对齐">
            <Button onClick={toggle('left')} icon={<IconAlignLeft />} type="tertiary" theme="borderless" />
          </Tooltip>

          <Tooltip content="居中">
            <Button onClick={toggle('center')} icon={<IconAlignCenter />} type="tertiary" theme="borderless" />
          </Tooltip>

          <Tooltip content="右对齐">
            <Button onClick={toggle('right')} icon={<IconAlignRight />} type="tertiary" theme="borderless" />
          </Tooltip>

          <Tooltip content="两端对齐">
            <Button onClick={toggle('justify')} icon={<IconAlignJustify />} type="tertiary" theme="borderless" />
          </Tooltip>
        </>
      }
    >
      <span>
        <Tooltip content="对齐方式" spacing={6}>
          <Button type="tertiary" theme="borderless" icon={current} disabled={isTitleActive}></Button>
        </Tooltip>
      </span>
    </Dropdown>
  );
};
