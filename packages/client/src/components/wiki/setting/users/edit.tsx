import React, { useCallback, useState } from "react";
import { Modal, Button, Select, Banner } from "@douyinfe/semi-ui";
import { WIKI_USER_ROLES, WikiUserRole } from "@think/share";

interface IProps {
  visible: boolean;
  toggleVisible: (arg) => void;
  onOk: (arg: WikiUserRole) => any;
}

export const EditUser: React.FC<IProps> = ({
  visible,
  toggleVisible,
  onOk,
}) => {
  const [userRole, setUserRole] = useState(WikiUserRole.normal);
  const handleOk = useCallback(() => {
    onOk(userRole).then(() => {
      setUserRole(WikiUserRole.normal);
      toggleVisible(false);
    });
  }, [onOk, userRole]);

  return (
    <Modal
      title={"修改角色"}
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
        <Select
          value={userRole}
          onChange={setUserRole}
          style={{ width: "100%" }}
        >
          {WIKI_USER_ROLES.map((wikiStatus) => {
            return (
              <Select.Option value={wikiStatus.value}>
                {wikiStatus.label}
              </Select.Option>
            );
          })}
        </Select>
        <Button
          theme="solid"
          block
          style={{ margin: "24px 0" }}
          onClick={handleOk}
        >
          提交修改
        </Button>
      </div>
    </Modal>
  );
};
