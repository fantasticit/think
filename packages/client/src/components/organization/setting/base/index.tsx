import { Avatar, Button, Form, Toast } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { ORGANIZATION_LOGOS } from '@think/constants';
import { IOrganization } from '@think/domains';
import { DataRender } from 'components/data-render';
import { ImageUploader } from 'components/image-uploader';
import { useOrganizationDetail } from 'data/organization';
import { useToggle } from 'hooks/use-toggle';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './index.module.scss';

const images = [
  {
    key: 'placeholers',
    title: '图库',
    images: ORGANIZATION_LOGOS,
  },
];

interface IProps {
  organizationId: IOrganization['id'];
}

export const Base: React.FC<IProps> = ({ organizationId }) => {
  const $form = useRef<FormApi>();
  const { data: organization, loading, error, update } = useOrganizationDetail(organizationId);
  const [changed, toggleChanged] = useToggle(false);
  const [currentCover, setCurrentCover] = useState('');

  const setCover = useCallback((url) => {
    $form.current.setValue('logo', url);
    setCurrentCover(url);
  }, []);

  const onFormChange = useCallback(() => {
    toggleChanged(true);
  }, [toggleChanged]);

  const onSubmit = useCallback(() => {
    $form.current.validate().then((values) => {
      update(values).then((res) => {
        Toast.success('操作成功');
      });
    });
  }, [update]);

  useEffect(() => {
    if (!organization) return;
    setCurrentCover(organization.logo);
    $form.current.setValues(organization);
  }, [organization]);

  return (
    <DataRender
      loading={loading}
      error={error}
      normalContent={() => (
        <Form
          style={{ width: '100%' }}
          getFormApi={(formApi) => ($form.current = formApi)}
          onChange={onFormChange}
          onSubmit={onSubmit}
        >
          <Form.Slot label="Logo">
            <div style={{ display: 'flex', alignItems: 'end' }}>
              <div className={styles.cover}>
                <Avatar
                  shape="square"
                  src={currentCover}
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 4,
                  }}
                />
              </div>
              <ImageUploader width={260} images={images} selectImage={setCover}>
                <Button>更换Logo</Button>
              </ImageUploader>
            </div>
          </Form.Slot>

          <Form.Input
            label="名称"
            field="name"
            style={{ width: '100%' }}
            placeholder="请输入组织名称"
            rules={[{ required: true, message: '请输入组织名称' }]}
          />

          <Form.TextArea
            label="描述"
            field="description"
            style={{ width: '100%' }}
            placeholder="请输入组织简介"
            autosize
            rules={[{ required: true, message: '请输入组织简介' }]}
          />

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button htmlType="submit" type="primary" theme="solid" disabled={!changed} loading={loading}>
              提交
            </Button>
          </div>
        </Form>
      )}
    />
  );
};
