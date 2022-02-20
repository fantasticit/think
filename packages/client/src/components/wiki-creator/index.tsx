import React from "react";
import { Button } from "@douyinfe/semi-ui";
import { useToggle } from "hooks/useToggle";
import { WikiCreator as WikiCreatorForm } from "components/wiki/create";

interface IProps {}

export const WikiCreator: React.FC<IProps> = ({ children }) => {
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
