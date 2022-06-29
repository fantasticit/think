import { Banner, Button, Modal, Select } from '@douyinfe/semi-ui';
import { AuthEnum, AuthEnumArray, IAuth, IUser } from '@think/domains';
import React, { useCallback, useEffect, useState } from 'react';

interface IProps {
  visible: boolean;
  toggleVisible: (arg) => void;
  currentUser: { user: IUser; auth: IAuth };
  onOk: (arg) => any;
}

export const EditUser: React.FC<IProps> = ({ visible, toggleVisible, currentUser, onOk }) => {
  const [userAuth, setUserAuth] = useState(AuthEnum.noAccess);

  const handleOk = useCallback(() => {
    onOk(userAuth).then(() => {
      setUserAuth(AuthEnum.noAccess);
      toggleVisible(false);
    });
  }, [onOk, userAuth, toggleVisible]);

  useEffect(() => {
    if (!visible) {
      setUserAuth(AuthEnum.noAccess);
    }
  }, [visible]);

  return (
    <Modal
      title={`修改用户${currentUser && currentUser.user.name}权限`}
      visible={visible}
      onOk={handleOk}
      onCancel={() => toggleVisible(false)}
      maskClosable={false}
      style={{ maxWidth: '96vw' }}
      footer={null}
    >
      <div style={{ marginTop: 16 }}>
        {[AuthEnum.creator, AuthEnum.admin].includes(userAuth) ? (
          <Banner style={{ marginBottom: 16 }} type="warning" description="请谨慎操作管理员权限！" />
        ) : null}
        {}
        <Select value={userAuth} onChange={setUserAuth} style={{ width: '100%' }}>
          {AuthEnumArray.map((wikiStatus) => {
            return (
              <Select.Option key={wikiStatus.value} value={wikiStatus.value}>
                {wikiStatus.label}
              </Select.Option>
            );
          })}
        </Select>
        <Button theme="solid" block style={{ margin: '24px 0' }} onClick={handleOk}>
          提交修改
        </Button>
      </div>
    </Modal>
  );
};
