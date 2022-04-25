import React from 'react';
import { Space } from '@douyinfe/semi-ui';
import { Divider } from './divider';

import { Insert } from './menus/insert';
import { Undo } from './menus/undo';
import { Redo } from './menus/redo';
import { CleadrNodeAndMarks } from './menus/clear-node-and-marks';

import { Heading } from './menus/heading';
import { FontSize } from './menus/fontsize';
import { Bold } from './menus/bold';
import { Italic } from './menus/italic';
import { Underline } from './menus/underline';
import { Strike } from './menus/strike';
import { Code } from './menus/code';
import { Superscript } from './menus/superscript';
import { Subscript } from './menus/subscript';
import { TextColor } from './menus/text-color';
import { BackgroundColor } from './menus/background-color';

import { Align } from './menus/align';

import { BulletList } from './menus/bullet-list';
import { OrderedList } from './menus/ordered-list';
import { TaskList } from './menus/task-list';
import { Ident } from './menus/ident';

import { Emoji } from './menus/emoji';
import { Link } from './menus/link';
import { Blockquote } from './menus/blockquote';
import { HorizontalRule } from './menus/horizontal-rule';
import { Search } from './menus/search';

import { Banner } from './menus/banner';
import { Countdonw } from './menus/countdown';
import { Image } from './menus/image';
import { Iframe } from './menus/iframe';
import { Table } from './menus/table';

export const MenuBar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div>
      <Space spacing={2}>
        <Insert editor={editor} />

        <Divider />

        <Undo editor={editor} />
        <Redo editor={editor} />
        <CleadrNodeAndMarks editor={editor} />

        <Divider />

        <Heading editor={editor} />
        <FontSize editor={editor} />
        <Bold editor={editor} />
        <Italic editor={editor} />
        <Underline editor={editor} />
        <Strike editor={editor} />
        <Code editor={editor} />
        <Superscript editor={editor} />
        <Subscript editor={editor} />
        <TextColor editor={editor} />
        <BackgroundColor editor={editor} />

        <Divider />

        <Align editor={editor} />

        <Divider />

        <BulletList editor={editor} />
        <OrderedList editor={editor} />
        <TaskList editor={editor} />
        <Ident editor={editor} />

        <Divider />

        <Emoji editor={editor} />
        <Link editor={editor} />
        <Blockquote editor={editor} />
        <HorizontalRule editor={editor} />
        <Search editor={editor} />

        <Banner editor={editor} />
        <Countdonw editor={editor} />
        <Image editor={editor} />
        <Iframe editor={editor} />
        <Table editor={editor} />
      </Space>
    </div>
  );
};

export const CommentMenuBar: React.FC<{ editor: any }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <>
      <Space spacing={2}>
        <Undo editor={editor} />
        <Redo editor={editor} />
        <CleadrNodeAndMarks editor={editor} />

        <Divider />

        <Heading editor={editor} />
        <Bold editor={editor} />
        <Italic editor={editor} />
        <Underline editor={editor} />
        <Strike editor={editor} />
        <Code editor={editor} />
        <Superscript editor={editor} />
        <Subscript editor={editor} />
        <TextColor editor={editor} />
        <BackgroundColor editor={editor} />
      </Space>
    </>
  );
};
