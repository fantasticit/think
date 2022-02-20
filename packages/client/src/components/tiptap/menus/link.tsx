import { useEffect, useState } from "react";
import { Space, Button, Tooltip, Input } from "@douyinfe/semi-ui";
import {
  IconExternalOpen,
  IconUnlink,
  IconTickCircle,
} from "@douyinfe/semi-icons";
import { BubbleMenu } from "../components/bubble-menu";
import { Link } from "../extensions/link";

export const LinkBubbleMenu = ({ editor }) => {
  const attrs = editor.getAttributes(Link.name);
  const { href, target } = attrs;
  const [url, setUrl] = useState("");

  useEffect(() => {
    setUrl(href);
  }, [href]);

  return (
    <BubbleMenu
      className={"bubble-menu"}
      editor={editor}
      pluginKey="link-bubble-menu"
      shouldShow={() => editor.isActive(Link.name)}
      tippyOptions={{ maxWidth: 456 }}
    >
      <Space>
        <Input
          value={url}
          onChange={(v) => setUrl(v)}
          placeholder={"输入链接"}
          onEnterPress={(e) => {
            // @ts-ignore
            const url = e.target.value;
            setUrl(url);
          }}
        />
        <Tooltip content="设置链接" zIndex={10000}>
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconTickCircle />}
            onClick={() => {
              editor
                .chain()
                .extendMarkRange(Link.name)
                .updateAttributes(Link.name, {
                  href: url,
                })
                .focus()
                .run();
            }}
          />
        </Tooltip>
        <Tooltip content="去除链接" zIndex={10000}>
          <Button
            onClick={() => {
              editor.chain().unsetLink().run();
            }}
            icon={<IconUnlink />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>
        <Tooltip content="访问链接" zIndex={10000}>
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconExternalOpen />}
            onClick={() => {
              if (href) {
                window.open(href, target);
              }
            }}
          />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
