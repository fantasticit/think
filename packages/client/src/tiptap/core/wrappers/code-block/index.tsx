import { IconCopy } from '@douyinfe/semi-icons';
import { Button, Select, Tooltip } from '@douyinfe/semi-ui';
import { NodeViewContent } from '@tiptap/react';
import cls from 'classnames';
import { copy } from 'helpers/copy';
import React, { useRef } from 'react';
import { DragableWrapper } from 'tiptap/core/wrappers/dragable';

import styles from './index.module.scss';

export const CodeBlockWrapper = ({ editor, node: { attrs }, updateAttributes, extension }) => {
  const isEditable = editor.isEditable;
  const { language: defaultLanguage } = attrs;
  const $container = useRef<HTMLPreElement>();

  return (
    <DragableWrapper editor={editor} className={cls(styles.wrap, 'render-wrapper')}>
      <div className={styles.handleWrap}>
        <Select
          size="small"
          defaultValue={defaultLanguage || 'null'}
          onChange={(value) => updateAttributes({ language: value })}
          className={styles.selectorWrap}
          disabled={!isEditable}
          filter
        >
          <Select.Option value="null">auto</Select.Option>
          {extension.options.lowlight.listLanguages().map((lang, index) => (
            <Select.Option key={index} value={lang}>
              {lang}
            </Select.Option>
          ))}
        </Select>
        <Tooltip content="复制" spacing={6}>
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconCopy />}
            onClick={() => copy($container.current.innerText)}
          />
        </Tooltip>
      </div>
      <pre ref={$container}>
        <NodeViewContent as="code" />
      </pre>
    </DragableWrapper>
  );
};
