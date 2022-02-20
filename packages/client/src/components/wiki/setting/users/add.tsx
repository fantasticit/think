import React, { useCallback, useState } from "react";
import {
  Modal,
  Typography,
  Button,
  Input,
  Space,
  Select,
  Banner,
} from "@douyinfe/semi-ui";
import { WIKI_USER_ROLES, WikiUserRole } from "@think/share";
import { IWikiUserOpeateData } from "data/wiki";

interface IProps {
  visible: boolean;
  toggleVisible: (arg) => void;
  onOk: (arg: IWikiUserOpeateData) => any;
}

const { Paragraph } = Typography;

export const AddUser: React.FC<IProps> = ({ visible, toggleVisible, onOk }) => {
  const [userRole, setUserRole] = useState(WikiUserRole.normal);
  const [userName, setUserName] = useState("");
  const handleOk = useCallback(() => {
    onOk({ userName, userRole } as unknown as IWikiUserOpeateData).then(() => {
      setUserRole(WikiUserRole.normal);
      setUserName("");
      toggleVisible(false);
    });
  }, [onOk, userName, userRole]);

  return (
    <Modal
      title={"添加成员"}
      okText={"邀请对方"}
      visible={visible}
      onOk={handleOk}
      onCancel={() => toggleVisible(false)}
      maskClosable={false}
      style={{ maxWidth: "96vw" }}
      footer={null}
    >
      <div style={{ marginTop: 16 }}>
        {userRole === WikiUserRole.admin ? (
          <Banner
            style={{ marginBottom: 16 }}
            type="warning"
            description="请谨慎操作管理员权限！"
          />
        ) : null}
        <Space>
          <Select
            value={userRole}
            onChange={setUserRole}
            style={{ width: 120 }}
          >
            {WIKI_USER_ROLES.map((wikiStatus) => {
              return (
                <Select.Option value={wikiStatus.value}>
                  {wikiStatus.label}
                </Select.Option>
              );
            })}
          </Select>
          <Input
            autofocus
            placeholder="输入对方用户名"
            value={userName}
            onChange={setUserName}
            style={{ width: 270 }}
          ></Input>
        </Space>
        <Button
          theme="solid"
          block
          style={{ margin: "24px 0" }}
          onClick={handleOk}
          disabled={!userName}
        >
          添加成员
        </Button>
      </div>
    </Modal>
  );
};
