import { Avatar, Banner, Button, Pagination, Space, Spin, Typography } from '@douyinfe/semi-ui';
import { DataRender } from 'components/data-render';
import { useComments } from 'data/comment';
import { useUser } from 'data/user';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useRef, useState } from 'react';
import { EditorContent, useEditor } from 'tiptap/core';
import { CommentKit, CommentMenuBar } from 'tiptap/editor';

import { Comments } from './comments';
import styles from './index.module.scss';

interface IProps {
  documentId: string;
}

const { Text, Paragraph } = Typography;

export const CommentEditor: React.FC<IProps> = ({ documentId }) => {
  const { user, toLogin } = useUser();
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

  const editor = useEditor({
    editable: true,
    extensions: CommentKit,
  });

  const openEditor = useCallback(() => {
    if (!user) {
      return toLogin();
    }
    toggleIsEdit(true);
    editor.chain().focus();
  }, [editor, toLogin, toggleIsEdit, user]);

  const handleClose = useCallback(() => {
    setReplyComment(null);
    setEditComment(null);
    toggleIsEdit(false);
  }, [toggleIsEdit]);

  const save = useCallback(() => {
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
  }, [addComment, editComment, editor, handleClose, replyComment, updateComment]);

  const handleReplyComment = useCallback(
    (comment) => {
      setReplyComment(comment);
      setEditComment(null);
      openEditor();
    },
    [openEditor]
  );

  const handleEditComment = useCallback(
    (comment) => {
      setReplyComment(null);
      setEditComment(comment);
      openEditor();
    },
    [openEditor]
  );

  return (
    <div ref={$container}>
      <DataRender
        loading={loading}
        error={error}
        loadingContent={null}
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
                  <Pagination total={commentsData.total} showTotal onPageChange={setPage}></Pagination>
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
              <div dangerouslySetInnerHTML={{ __html: replyComment.html }}></div>
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
                <div style={{ width: '100%', overflow: 'auto' }}>
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
                  <Button theme="borderless" type="tertiary" onClick={handleClose}>
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
