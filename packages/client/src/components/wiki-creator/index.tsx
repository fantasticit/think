import { Button } from '@douyinfe/semi-ui';
import { WikiCreator as WikiCreatorForm } from 'components/wiki/create';
import { useToggle } from 'hooks/use-toggle';
import React from 'react';

export const WikiCreator: React.FC = ({ children }) => {
  const [visible, toggleVisible] = useToggle(false);

  return (
    <>
      {children || (
        <Button type="primary" theme="solid" onClick={toggleVisible}>
          新建知识库
        </Button>
      )}
      <WikiCreatorForm visible={visible} toggleVisible={toggleVisible} />
    </>
  );
};
