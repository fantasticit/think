import { Banner, Button, Input, Modal, Select, Space } from '@douyinfe/semi-ui';
import { AuthEnum, AuthEnumArray } from '@think/domains';
import React, { useCallback, useState } from 'react';

interface IProps {
  visible: boolean;
  toggleVisible: (arg) => void;
  onOk: (arg) => any;
}

export const AddUser: React.FC<IProps> = ({ visible, toggleVisible, onOk }) => {
  const [userAuth, setUserAuth] = useState(AuthEnum.noAccess);
  const [userName, setUserName] = useState('');

  const handleOk = useCallback(() => {
    onOk({ userName, userAuth }).then(() => {
      setUserAuth(AuthEnum.noAccess);
      setUserName('');
      toggleVisible(false);
    });
  }, [onOk, userName, userAuth, toggleVisible]);

  return (
    <Modal
      title={'添加成员'}
      okText={'邀请对方'}
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
        <Space>
          <Select value={userAuth} onChange={setUserAuth} style={{ width: 120 }}>
            {AuthEnumArray.map((wikiStatus) => {
              return (
                <Select.Option key={wikiStatus.value} value={wikiStatus.value}>
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
        <Button theme="solid" block style={{ margin: '24px 0' }} onClick={handleOk} disabled={!userName}>
          添加成员
        </Button>
      </div>
    </Modal>
  );
};
