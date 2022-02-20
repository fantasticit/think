import React, { useRef, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import {
  Avatar,
  Button,
  Space,
  Typography,
  Banner,
  Pagination,
} from "@douyinfe/semi-ui";
import { useToggle } from "hooks/useToggle";
import { useClickOutside } from "hooks/use-click-outside";
import { DEFAULT_EXTENSION, Document, CommentMenuBar } from "components/tiptap";
import { DataRender } from "components/data-render";
import { useUser } from "data/user";
import { useComments } from "data/comment";
import { Comments } from "./comments";
import { CommentItemPlaceholder } from "./comments/Item";
import styles from "./index.module.scss";

interface IProps {
  documentId: string;
}

const { Text, Paragraph } = Typography;

export const CommentEditor: React.FC<IProps> = ({ documentId }) => {
  const { user } = useUser();
  const {
    data: commentsData,
    loading,
    error,
    setPage,
    addComment,
    updateComment,
    deleteComment,
  } = useComments(documentId);
  const [isEdit, toggleIsEdit] = useToggle(false);
  const $container = useRef<HTMLDivElement>();
  const [replyComment, setReplyComment] = useState(null);
  const [editComment, setEditComment] = useState(null);

  useClickOutside($container, {
    out: () => isEdit && toggleIsEdit(false),
  });

  const editor = useEditor({
    editable: true,
    extensions: [...DEFAULT_EXTENSION, Document],
  });

  const openEditor = () => {
    toggleIsEdit(true);
    editor.chain().focus();
  };

  const handleClose = () => {
    setReplyComment(null);
    setEditComment(null);
    toggleIsEdit(false);
  };

  const save = () => {
    const html = editor.getHTML();

    if (editComment) {
      return updateComment({
        id: editComment.id,
        html,
      }).then(() => {
        editor.commands.clearNodes();
        editor.commands.clearContent();
        handleClose();
      });
    }

    return addComment({
      html,
      parentCommentId: (replyComment && replyComment.id) || null,
      replyUserId: (replyComment && replyComment.createUserId) || null,
    }).then(() => {
      editor.commands.clearNodes();
      editor.commands.clearContent();
      handleClose();
    });
  };

  const handleReplyComment = (comment) => {
    setReplyComment(comment);
    setEditComment(null);
    openEditor();
  };

  const handleEditComment = (comment) => {
    setReplyComment(null);
    setEditComment(comment);
    openEditor();
  };

  return (
    <div ref={$container}>
      <DataRender
        loading={loading}
        error={error}
        loadingContent={
          <>
            {Array.from({ length: 5 }, (_, i) => i).map((i) => (
              <CommentItemPlaceholder key={i} />
            ))}
          </>
        }
        normalContent={() => (
          <>
            {commentsData.total > 0 && (
              <Space>
                <Text strong>评论</Text>
              </Space>
            )}
            {commentsData.total > 0 && (
              <div className={styles.commentsWrap}>
                <Comments
                  comments={commentsData && commentsData.data}
                  replyComment={handleReplyComment}
                  editComment={handleEditComment}
                  deleteComment={deleteComment}
                />
                <div className={styles.paginationWrap}>
                  <Pagination
                    total={commentsData.total}
                    showTotal
                    onPageChange={setPage}
                  ></Pagination>
                </div>
              </div>
            )}
          </>
        )}
      />
      {replyComment && replyComment.createUser && (
        <Banner
          key={replyComment.id}
          fullMode={false}
          type="info"
          icon={null}
          title={<Text>回复评论： {replyComment.createUser.name}</Text>}
          description={
            <Paragraph ellipsis={{ rows: 2 }}>
              <div
                dangerouslySetInnerHTML={{ __html: replyComment.html }}
              ></div>
            </Paragraph>
          }
          onClose={handleClose}
        />
      )}
      {editComment && (
        <Banner
          key={editComment.id}
          fullMode={false}
          type="info"
          icon={null}
          title={<Text>编辑评论</Text>}
          description={
            <Paragraph ellipsis={{ rows: 2 }}>
              <div dangerouslySetInnerHTML={{ __html: editComment.html }}></div>
            </Paragraph>
          }
          onClose={handleClose}
        />
      )}
      <div className={styles.editorOuterWrap}>
        <div className={styles.leftWrap}>
          {user && (
            <Avatar size="small" src={user.avatar}>
              {user.name.charAt(0)}
            </Avatar>
          )}
        </div>

        <div className={styles.rightWrap}>
          {isEdit ? (
            <>
              <div className={styles.editorWrap}>
                <div style={{ width: "100%", overflow: "auto" }}>
                  <CommentMenuBar editor={editor} />
                </div>
                <div className={styles.innerWrap}>
                  <EditorContent autoFocus editor={editor} />
                </div>
              </div>
              <div className={styles.btnWrap}>
                <Space>
                  <Button theme="solid" type="primary" onClick={save}>
                    保存
                  </Button>
                  <Button
                    theme="borderless"
                    type="tertiary"
                    onClick={handleClose}
                  >
                    取消
                  </Button>
                </Space>
              </div>
            </>
          ) : (
            <div className={styles.placeholderWrap} onClick={openEditor}>
              <Text type="tertiary"> 写下评论...</Text>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
