import { Button } from '@douyinfe/semi-ui';
import { EmojiPicker } from 'components/emoji-picker';
import { IconEmoji } from 'components/icons';
import { Tooltip } from 'components/tooltip';
import React, { useCallback } from 'react';
import { Editor } from 'tiptap/core';

export const Emoji: React.FC<{ editor: Editor }> = ({ editor }) => {
  const setEmoji = useCallback(
    (emoji) => {
      const { selection } = editor.state;
      const { $anchor } = selection;
      return editor.chain().insertContentAt($anchor.pos, emoji).run();
    },
    [editor]
  );

  return (
    <EmojiPicker onSelectEmoji={setEmoji}>
      <span>
        <Tooltip content="插入表情">
          <Button theme={'borderless'} type="tertiary" icon={<IconEmoji />} />
        </Tooltip>
      </span>
    </EmojiPicker>
  );
};
