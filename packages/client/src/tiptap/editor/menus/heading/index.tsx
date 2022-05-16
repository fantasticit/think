import { Select } from '@douyinfe/semi-ui';
import React, { useCallback, useMemo } from 'react';
import { Title } from 'tiptap/core/extensions/title';
import { Editor } from 'tiptap/editor';
import { useActive } from 'tiptap/editor/hooks/use-active';

export const Heading: React.FC<{ editor: Editor }> = ({ editor }) => {
  const isTitleActive = useActive(editor, Title.name);
  const isH1 = useActive(editor, 'heading', { level: 1 });
  const isH2 = useActive(editor, 'heading', { level: 2 });
  const isH3 = useActive(editor, 'heading', { level: 3 });
  const isH4 = useActive(editor, 'heading', { level: 4 });
  const isH5 = useActive(editor, 'heading', { level: 5 });
  const isH6 = useActive(editor, 'heading', { level: 6 });
  const current = useMemo(() => {
    if (isH1) return 1;
    if (isH2) return 2;
    if (isH3) return 3;
    if (isH4) return 4;
    if (isH5) return 5;
    if (isH6) return 6;
    return 'paragraph';
  }, [isH1, isH2, isH3, isH4, isH5, isH6]);

  const toggle = useCallback(
    (level) => {
      if (level === 'paragraph') {
        editor.chain().focus().setParagraph().run();
      } else {
        editor.chain().focus().toggleHeading({ level }).run();
      }
    },
    [editor]
  );

  return (
    <Select disabled={isTitleActive} value={current} onChange={toggle} style={{ width: 90, marginRight: 10 }}>
      <Select.Option value="paragraph">正文</Select.Option>
      <Select.Option value={1}>
        <h1 style={{ margin: 0, fontSize: '1.3em' }}>标题1</h1>
      </Select.Option>
      <Select.Option value={2}>
        <h2 style={{ margin: 0, fontSize: '1.1em' }}>标题2</h2>
      </Select.Option>
      <Select.Option value={3}>
        <h3 style={{ margin: 0, fontSize: '1.0em' }}>标题3</h3>
      </Select.Option>
      <Select.Option value={4}>
        <h4 style={{ margin: 0, fontSize: '0.9em' }}>标题4</h4>
      </Select.Option>
      <Select.Option value={5}>
        <h5 style={{ margin: 0, fontSize: '0.8em' }}>标题5</h5>
      </Select.Option>
      <Select.Option value={6}>
        <h6 style={{ margin: 0, fontSize: '0.8em' }}>标题6</h6>
      </Select.Option>
    </Select>
  );
};
