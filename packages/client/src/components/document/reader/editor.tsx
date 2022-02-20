import React, { useMemo, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import { Layout } from "@douyinfe/semi-ui";
import { IUser } from "@think/share";
import { useToggle } from "hooks/useToggle";
import {
  DEFAULT_EXTENSION,
  DocumentWithTitle,
  getCollaborationExtension,
  getCollaborationCursorExtension,
  getProvider,
  destoryProvider,
} from "components/tiptap";
import { DataRender } from "components/data-render";
import { joinUser } from "components/document/collaboration";
import styles from "./index.module.scss";

const { Content } = Layout;

interface IProps {
  user: IUser;
  documentId: string;
}

export const Editor: React.FC<IProps> = ({ user, documentId }) => {
  if (!user) return null;

  const provider = useMemo(() => {
    return getProvider({
      targetId: documentId,
      token: user.token,
      cacheType: "READER",
      user,
      docType: "document",
      events: {
        onAwarenessUpdate({ states }) {
          joinUser({ states });
        },
      },
    });
  }, [documentId, user.token]);
  const editor = useEditor({
    editable: false,
    extensions: [
      ...DEFAULT_EXTENSION,
      DocumentWithTitle,
      getCollaborationExtension(provider),
      getCollaborationCursorExtension(provider, user),
    ],
  });
  const [loading, toggleLoading] = useToggle(true);

  useEffect(() => {
    provider.on("synced", () => {
      toggleLoading(false);
    });

    return () => {
      destoryProvider(provider, "READER");
    };
  }, []);

  return (
    <DataRender
      loading={loading}
      error={null}
      normalContent={() => {
        return (
          <>
            <Content className={styles.editorWrap}>
              <EditorContent editor={editor} />
            </Content>
          </>
        );
      }}
    />
  );
};
