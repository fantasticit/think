import React from "react";
import type { IComment } from "@think/share";
import { CommentItem } from "./Item";

interface IProps {
  comments: Array<IComment>;
  replyComment: (comment: IComment) => void;
  editComment: (comment: IComment) => void;
  deleteComment: (comment: IComment) => void;
}

const PADDING_LEFT = 32;

const CommentInner = ({
  data,
  depth,
  replyComment,
  editComment,
  deleteComment,
}) => {
  return (
    <div
      key={"comment" + depth}
      style={{ paddingLeft: depth > 0 ? PADDING_LEFT : 0 }}
    >
      {(data || []).map((item) => {
        const hasChildren = item.children && item.children.length;
        return (
          <>
            <CommentItem
              key={item.id}
              comment={item}
              replyComment={replyComment}
              editComment={editComment}
              deleteComment={deleteComment}
            ></CommentItem>
            {hasChildren ? (
              <CommentInner
                key={"comment-inner" + depth}
                data={item.children}
                depth={depth + 1}
                replyComment={replyComment}
                editComment={editComment}
                deleteComment={deleteComment}
              />
            ) : null}
          </>
        );
      })}
    </div>
  );
};

export const Comments: React.FC<IProps> = ({
  comments,
  replyComment,
  editComment,
  deleteComment,
}) => {
  return (
    <CommentInner
      key={"root-menu"}
      data={comments}
      depth={0}
      replyComment={replyComment}
      editComment={editComment}
      deleteComment={deleteComment}
    />
  );
};
