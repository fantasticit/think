import { Space, Button, Tooltip } from "@douyinfe/semi-ui";
import {
  IconDelete,
  IconTickCircle,
  IconAlertTriangle,
  IconClear,
  IconInfoCircle,
} from "@douyinfe/semi-icons";
import { BubbleMenu } from "../components/bubble-menu";
import { Divider } from "../components/divider";
import { Banner } from "../extensions/banner";
import { deleteNode } from "../utils/delete";

export const BannerBubbleMenu = ({ editor }) => {
  return (
    <BubbleMenu
      className={"bubble-menu"}
      editor={editor}
      pluginKey="banner-bubble-menu"
      shouldShow={() => editor.isActive(Banner.name)}
      matchRenderContainer={(node) =>
        node && node.id === "js-bannber-container"
      }
    >
      <Space>
        <Tooltip content="信息" zIndex={10000}>
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={
              <IconInfoCircle style={{ color: "var(--semi-color-info)" }} />
            }
            onClick={() => {
              editor
                .chain()
                .updateAttributes(Banner.name, {
                  type: "info",
                })
                .focus()
                .run();
            }}
          />
        </Tooltip>

        <Tooltip content="警告" zIndex={10000}>
          <Button
            onClick={() => {
              editor
                .chain()
                .updateAttributes(Banner.name, {
                  type: "warning",
                })
                .focus()
                .run();
            }}
            icon={
              <IconAlertTriangle
                style={{ color: "var(--semi-color-warning)" }}
              />
            }
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>

        <Tooltip content="危险" zIndex={10000}>
          <Button
            onClick={() => {
              editor
                .chain()
                .updateAttributes(Banner.name, {
                  type: "danger",
                })
                .focus()
                .run();
            }}
            icon={<IconClear style={{ color: "var(--semi-color-danger)" }} />}
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>

        <Tooltip content="成功" zIndex={10000}>
          <Button
            onClick={() => {
              editor
                .chain()
                .updateAttributes(Banner.name, {
                  type: "success",
                })
                .focus()
                .run();
            }}
            icon={
              <IconTickCircle style={{ color: "var(--semi-color-success)" }} />
            }
            type="tertiary"
            theme="borderless"
            size="small"
          />
        </Tooltip>

        <Divider />

        <Tooltip content="删除" zIndex={10000}>
          <Button
            size="small"
            type="tertiary"
            theme="borderless"
            icon={<IconDelete />}
            onClick={() => deleteNode("banner", editor)}
          />
        </Tooltip>
      </Space>
    </BubbleMenu>
  );
};
