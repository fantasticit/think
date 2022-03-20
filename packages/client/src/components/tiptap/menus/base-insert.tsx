import React from 'react';
import { Button } from '@douyinfe/semi-ui';
import { IconQuote, IconCheckboxIndeterminate, IconLink } from '@douyinfe/semi-icons';
import { Tooltip } from 'components/tooltip';
import { isTitleActive } from '../services/isActive';
import { Emoji } from './components/emoji';
import { Search } from './search';

export const BaseInsertMenu: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Emoji editor={editor} />

      <Tooltip content="插入链接">
        <Button
          theme={editor.isActive('link') ? 'light' : 'borderless'}
          type="tertiary"
          icon={<IconLink />}
          onClick={() => editor.chain().focus().toggleLink().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip content="插入引用">
        <Button
          theme={editor.isActive('blockquote') ? 'light' : 'borderless'}
          type="tertiary"
          icon={<IconQuote />}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Tooltip content="插入分割线">
        <Button
          theme={'borderless'}
          type="tertiary"
          icon={<IconCheckboxIndeterminate />}
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          disabled={isTitleActive(editor)}
        />
      </Tooltip>

      <Search editor={editor} />
    </>
  );
};
