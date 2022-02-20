import React from "react";
import { BubbleMenu, Editor } from "@tiptap/react";
import { Space } from "@douyinfe/semi-ui";
import { Title } from "../extensions/title";
import { Link } from "../extensions/link";
import { Attachment } from "../extensions/attachment";
import { Image } from "../extensions/image";
import { Banner } from "../extensions/banner";
import { Iframe } from "../extensions/iframe";
import { Mind } from "../extensions/mind";
import { Table } from "../extensions/table";
import { Katex } from "../extensions/katex";
import { DocumentReference } from "../extensions/documents/reference";
import { DocumentChildren } from "../extensions/documents/children";
import { BaseMenu } from "./base-menu";

const OTHER_BUBBLE_MENU_TYPES = [
  Title.name,
  Link.name,
  Attachment.name,
  Image.name,
  Banner.name,
  Iframe.name,
  Mind.name,
  Table.name,
  DocumentReference.name,
  DocumentChildren.name,
  Katex.name,
];

export const BaseBubbleMenu: React.FC<{ editor: Editor }> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <BubbleMenu
      editor={editor}
      className={"bubble-menu"}
      pluginKey="base-bubble-menu"
      shouldShow={() =>
        !editor.state.selection.empty &&
        OTHER_BUBBLE_MENU_TYPES.every((type) => !editor.isActive(type))
      }
    >
      <Space>
        <BaseMenu editor={editor} />
      </Space>
    </BubbleMenu>
  );
};
