import React, { useRef } from "react";
import {
  ReactNodeViewRenderer,
  NodeViewWrapper,
  NodeViewContent,
} from "@tiptap/react";
import { Button, Select, Tooltip } from "@douyinfe/semi-ui";
import { IconCopy } from "@douyinfe/semi-icons";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
// @ts-ignore
import { lowlight } from "lowlight";
import { copy } from "helpers/copy";
import styles from "./index.module.scss";

const Render = ({
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
    <NodeViewWrapper className={styles.wrap}>
      <div className={styles.handleWrap}>
        {isEditable && (
          <Select
            size="small"
            defaultValue={defaultLanguage || "null"}
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

export const CodeBlock = CodeBlockLowlight.extend({
  addNodeView() {
    return ReactNodeViewRenderer(Render);
  },
}).configure({ lowlight });
