import { Banner, Popconfirm, Select, Toast } from '@douyinfe/semi-ui';
import { AuthEnum, AuthEnumArray, IAuth, IUser } from '@think/domains';
import React, { useCallback, useState } from 'react';

interface IProps {
  userWithAuth: { user: IUser; auth: IAuth };
  updateUser: (arg) => any;
}

export const EditUser: React.FC<IProps> = ({ userWithAuth, updateUser, children }) => {
  const [userAuth, setUserAuth] = useState(AuthEnum.noAccess);

  const handleOk = useCallback(() => {
    return updateUser({ userName: userWithAuth.user.name, userAuth }).then(() => {
      Toast.success('操作成功');
    });
  }, [updateUser, userAuth, userWithAuth]);

  return (
    <Popconfirm
      showArrow
      position="bottomRight"
      zIndex={1070}
      title={`修改用户${userWithAuth && userWithAuth.user.name}权限`}
      content={
        <div style={{ margin: '16px -68px 0 0' }}>
          {[AuthEnum.creator, AuthEnum.admin].includes(userAuth) ? (
            <Banner style={{ marginBottom: 16 }} type="warning" description="请谨慎操作管理员权限！" />
          ) : null}
          {}
          <Select value={userAuth} onChange={setUserAuth} style={{ width: '100%' }} zIndex={1080}>
            {AuthEnumArray.map((wikiStatus) => {
              return (
                <Select.Option key={wikiStatus.value} value={wikiStatus.value}>
                  {wikiStatus.label}
                </Select.Option>
              );
            })}
          </Select>
        </div>
      }
      onConfirm={handleOk}
    >
      {children}
    </Popconfirm>
  );
};
