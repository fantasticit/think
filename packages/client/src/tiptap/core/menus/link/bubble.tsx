import { IconEdit, IconExternalOpen, IconUnlink } from '@douyinfe/semi-icons';
import { Button, Space } from '@douyinfe/semi-ui';
import { Divider } from 'components/divider';
import { Tooltip } from 'components/tooltip';
import { useCallback, useEffect, useState } from 'react';
import { BubbleMenu } from 'tiptap/core/bubble-menu';
import { Link } from 'tiptap/core/extensions/link';
import { useAttributes } from 'tiptap/core/hooks/use-attributes';
import { findMarkPosition, isMarkActive } from 'tiptap/prose-utils';

import { triggerOpenLinkSettingModal } from '../_event';

export const LinkBubbleMenu = ({ editor }) => {
  const { href, target } = useAttributes(editor, Link.name, { href: '', target: '' });
  const [text, setText] = useState();
  const [from, setFrom] = useState(-1);
  const [to, setTo] = useState(-1);

  const shouldShow = useCallback(() => editor.isActive(Link.name), [editor]);

  const visitLink = useCallback(() => {
    window.open(href, target);
  }, [href, target]);

  const openEditLinkModal = useCallback(() => {
    triggerOpenLinkSettingModal(editor, { href, text, from, to });
  }, [editor, href, text, from, to]);

  const unsetLink = useCallback(() => editor.chain().extendMarkRange(Link.name).unsetLink().run(), [editor]);

  useEffect(() => {
    const listener = () => {
      const isLinkActive = editor.isActive(Link.name);

      if (!isLinkActive) return;

      const { state } = editor;
      const isInLink = isMarkActive(state.schema.marks.link)(state);

      if (!isInLink) return;

      const { $head, from, to } = editor.state.selection;
      const marks = $head.marks();

      let start;
      let end;

      if (marks.length) {
        const mark = marks[0];
        const node = $head.node($head.depth);
        const startPosOfThisLine = $head.pos - (($head.nodeBefore && $head.nodeBefore.nodeSize) || 0);
        const endPosOfThisLine = $head.nodeAfter
          ? startPosOfThisLine + $head.nodeAfter.nodeSize
          : $head.pos - $head.parentOffset + node.content.size;

        const { start: startPos, end: endPos } = findMarkPosition(state, mark, startPosOfThisLine, endPosOfThisLine);
        start = startPos;
        end = endPos;
      } else {
        start = from;
        end = to;
      }

      const text = state.doc.textBetween(start, end);
      setText(text);
      setFrom(start);
      setTo(end);
    };

    editor.on('selectionUpdate', listener);

    return () => {
      editor.off('selectionUpdate', listener);
    };
  }, [editor]);

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="link-bubble-menu"
      shouldShow={shouldShow}
      tippyOptions={{ maxWidth: 'calc(100vw - 100px)' }}
    >
      <Space spacing={4}>
        <Tooltip content="访问链接">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconExternalOpen />} onClick={visitLink} />
        </Tooltip>

        <Tooltip content="编辑链接">
          <Button size="small" type="tertiary" theme="borderless" icon={<IconEdit />} onClick={openEditLinkModal} />
        </Tooltip>

        <Divider />

        <Tooltip content="去除链接" hideOnClick>
          <Button onClick={unsetLink} icon={<IconUnlink />} type="tertiary" theme="borderless" size="small" />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
