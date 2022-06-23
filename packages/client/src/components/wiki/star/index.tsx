import { IconStar } from '@douyinfe/semi-icons';
import { Button, Tooltip } from '@douyinfe/semi-ui';
import { useWikiStarToggle } from 'data/star';
import React from 'react';

interface IProps {
  wikiId: string;
  render?: (arg: { star: boolean; text: string; toggleStar: () => Promise<void> }) => React.ReactNode;
  onChange?: () => void;
}

export const WikiStar: React.FC<IProps> = ({ wikiId, render, onChange }) => {
  const { data, toggle } = useWikiStarToggle(wikiId);
  const text = data ? '取消收藏' : '收藏知识库';

  return (
    <>
      {render ? (
        render({ star: data, toggleStar: toggle, text })
      ) : (
        <Tooltip content={text} position="bottom">
          <Button
            icon={<IconStar />}
            theme="borderless"
            style={{
              color: data ? 'rgba(var(--semi-amber-4), 1)' : 'rgba(var(--semi-grey-3), 1)',
            }}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              toggle().then(onChange);
            }}
          />
        </Tooltip>
      )}
    </>
  );
};
