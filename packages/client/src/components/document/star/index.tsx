import React from "react";
import { Typography, Tooltip, Button } from "@douyinfe/semi-ui";
import { IconStar } from "@douyinfe/semi-icons";
import { useDocumentStar } from "data/document";

interface IProps {
  documentId: string;
  render?: (arg: {
    star: boolean;
    text: string;
    toggleStar: () => Promise<void>;
  }) => React.ReactNode;
}

const { Text } = Typography;

export const DocumentStar: React.FC<IProps> = ({ documentId, render }) => {
  const { data, toggleStar } = useDocumentStar(documentId);
  const text = data ? "取消收藏" : "收藏文档";

  return (
    <>
      {render ? (
        render({ star: data, toggleStar, text })
      ) : (
        <Tooltip content={text} position="bottom">
          <Button
            icon={<IconStar />}
            theme="borderless"
            style={{
              color: data
                ? "rgba(var(--semi-amber-4), 1)"
                : "rgba(var(--semi-grey-3), 1)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggleStar();
            }}
          />
        </Tooltip>
      )}
    </>
  );
};
