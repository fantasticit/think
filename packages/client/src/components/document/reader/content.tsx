import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Layout } from "@douyinfe/semi-ui";
import { IDocument } from "@think/share";
import { DEFAULT_EXTENSION, DocumentWithTitle } from "components/tiptap";
import { safeJSONParse } from "helpers/json";

interface IProps {
  document: IDocument;
}

export const DocumentContent: React.FC<IProps> = ({ document }) => {
  const c = safeJSONParse(document.content);
  let json = c.default || c;

  if (json && json.content) {
    json = {
      type: "doc",
      content: json.content.slice(1),
    };
  }

  const editor = useEditor({
    editable: false,
    extensions: [...DEFAULT_EXTENSION, DocumentWithTitle],
    content: json,
  });

  if (!json) return null;

  return <EditorContent editor={editor} />;
};
