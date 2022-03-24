import React, { useRef } from 'react';
import cls from 'classnames';
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react';
import { Button, Select, Tooltip } from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';
import { copy } from 'helpers/copy';
import styles from './index.module.scss';

export const CodeBlockWrapper = ({
  editor,
  node: {
    attrs: { language: defaultLanguage },
  },
  updateAttributes,
  extension,
}) => {
  const isEditable = editor.isEditable;
  const $container = useRef<HTMLPreElement>();

  return (
    <NodeViewWrapper className={cls(styles.wrap, 'render-wrapper')}>
      <div className={styles.handleWrap}>
        {isEditable && (
          <Select
            size="small"
            defaultValue={defaultLanguage || 'null'}
            onChange={(value) => updateAttributes({ language: value })}
            className={styles.selectorWrap}
          >
            <Select.Option value="null">auto</Select.Option>
            {extension.options.lowlight.listLanguages().map((lang, index) => (
              <Select.Option key={index} value={lang}>
                {lang}
              </Select.Option>
            ))}
          </Select>
        )}
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
    </NodeViewWrapper>
  );
};
