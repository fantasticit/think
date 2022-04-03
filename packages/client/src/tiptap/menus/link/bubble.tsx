import { useEffect, useState, useRef, useCallback } from 'react';
import { Space, Button } from '@douyinfe/semi-ui';
import { IconExternalOpen, IconUnlink, IconEdit } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { Divider } from '../../divider';
import { BubbleMenu } from '../../views/bubble-menu';
import { Link } from '../../extensions/link';
import { isMarkActive } from '../../services/is-active';
import { findMarkPosition } from '../../services/find-position';
import { triggerOpenLinkSettingModal } from '../_event';

export const LinkBubbleMenu = ({ editor }) => {
  const attrs = editor.getAttributes(Link.name);
  const { href, target } = attrs;
  const isLinkActive = editor.isActive(Link.name);
  const [text, setText] = useState();
  const [from, setFrom] = useState(-1);
  const [to, setTo] = useState(-1);

  const visitLink = useCallback(() => {
    window.open(href, target);
  }, [href, target]);

  const openEditLinkModal = useCallback(() => {
    triggerOpenLinkSettingModal({ href, text, from, to });
  }, [href, text, from, to]);

  const unsetLink = useCallback(() => editor.chain().extendMarkRange(Link.name).unsetLink().run(), [editor]);

  useEffect(() => {
    if (!isLinkActive) return;

    const { state } = editor;
    const isInLink = isMarkActive(state.schema.marks.link)(state);

    if (!isInLink) return;

    const { $head } = editor.state.selection;
    const marks = $head.marks();
    if (!marks.length) return;

    const mark = marks[0];
    const node = $head.node($head.depth);
    const startPosOfThisLine = $head.pos - (($head.nodeBefore && $head.nodeBefore.nodeSize) || 0);
    const endPosOfThisLine = $head.nodeAfter
      ? startPosOfThisLine + $head.nodeAfter.nodeSize
      : $head.pos - $head.parentOffset + node.content.size;

    const { start, end } = findMarkPosition(state, mark, startPosOfThisLine, endPosOfThisLine);
    const text = state.doc.textBetween(start, end);
    setText(text);
    setFrom(start);
    setTo(end);
  });

  return (
    <BubbleMenu
      className={'bubble-menu'}
      editor={editor}
      pluginKey="link-bubble-menu"
      shouldShow={() => editor.isActive(Link.name)}
      tippyOptions={{ maxWidth: 456 }}
    >
      <Space>
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
