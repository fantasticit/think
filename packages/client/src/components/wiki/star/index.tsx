import React from "react";
import { Tooltip, Button } from "@douyinfe/semi-ui";
import { IconStar } from "@douyinfe/semi-icons";
import { useWikiStar } from "data/wiki";

interface IProps {
  wikiId: string;
  render?: (arg: {
    star: boolean;
    text: string;
    toggleStar: () => Promise<void>;
  }) => React.ReactNode;
  onChange?: () => void;
}

export const WikiStar: React.FC<IProps> = ({ wikiId, render, onChange }) => {
  const { data, toggleStar } = useWikiStar(wikiId);
  const text = data ? "取消收藏" : "收藏知识库";

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
              toggleStar().then(onChange);
            }}
          />
        </Tooltip>
      )}
    </>
  );
};
