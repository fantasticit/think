import { Dispatch, SetStateAction, useRef, useState, useEffect } from 'react';
import { Avatar, Form, Modal, Space } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { Upload } from 'components/upload';
import { useUser } from 'data/user';

interface IProps {
  visible: boolean;
  toggleVisible: Dispatch<SetStateAction<boolean>>;
}

export const UserSetting: React.FC<IProps> = ({ visible, toggleVisible }) => {
  const $form = useRef<FormApi>();
  const { user, loading, updateUser } = useUser();
  const [currentAvatar, setCurrentAvatar] = useState('');

  const setAvatar = (url) => {
    $form.current.setValue('avatar', url);
    setCurrentAvatar(url);
  };

  const handleOk = () => {
    $form.current.validate().then((values) => {
      if (!values.email) {
        delete values.email;
      }
      updateUser(values);
      toggleVisible(false);
    });
  };
  const handleCancel = () => {
    toggleVisible(false);
  };

  useEffect(() => {
    if (!user || !$form.current) return;
    $form.current.setValues(user);
    setCurrentAvatar(user.avatar);
  }, [user]);

  return (
    <Modal
      title="更新用户信息"
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      style={{ maxWidth: '96vw' }}
      okButtonProps={{ loading }}
    >
      <Form
        initValues={{ avatar: user.avatar, name: user.name, email: user.email }}
        getFormApi={(formApi) => ($form.current = formApi)}
        labelPosition="left"
      >
        <Form.Slot label="头像">
          <Space align="end">
            <Avatar src={currentAvatar} shape="square"></Avatar>
            <Upload onOK={setAvatar} />
          </Space>
        </Form.Slot>
        <Form.Input
          label="账户"
          field="name"
          style={{ width: '100%' }}
          disabled
          placeholder="请输入账户名称"
        ></Form.Input>
        <Form.Input label="邮箱" field="email" style={{ width: '100%' }} placeholder="请输入账户邮箱"></Form.Input>
      </Form>
    </Modal>
  );
};
