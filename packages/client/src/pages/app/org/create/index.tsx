import { Avatar, Button, Form, Typography } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { ORGANIZATION_LOGOS } from '@think/constants';
import { ImageUploader } from 'components/image-uploader';
import { Seo } from 'components/seo';
import { useCreateOrganization } from 'data/organization';
import { useToggle } from 'hooks/use-toggle';
import { SingleColumnLayout } from 'layouts/single-column';
import Router from 'next/router';
import { useCallback, useRef, useState } from 'react';

import styles from './index.module.scss';

const images = [
  {
    key: 'placeholers',
    title: '图库',
    images: ORGANIZATION_LOGOS,
  },
];

const { Title } = Typography;

const Page: React.FC = () => {
  const $form = useRef<FormApi>();
  const [changed, toggleChanged] = useToggle(false);
  const [currentCover, setCurrentCover] = useState('');
  const { create, loading } = useCreateOrganization();

  const setCover = useCallback((url) => {
    $form.current.setValue('logo', url);
    setCurrentCover(url);
  }, []);

  const onFormChange = useCallback(() => {
    toggleChanged(true);
  }, [toggleChanged]);

  const onSubmit = useCallback(() => {
    $form.current.validate().then((values) => {
      create(values).then((res) => {
        Router.push({
          pathname: `/app/org/[organizationId]`,
          query: { organizationId: res.id },
        });
      });
    });
  }, [create]);

  return (
    <SingleColumnLayout>
      <Seo title="新建组织" />
      <div className="container">
        <div>
          <Title heading={3} style={{ margin: '8px 0' }}>
            新建组织
          </Title>
        </div>
        <Form
          style={{ width: '100%' }}
          initValues={{
            logo: ORGANIZATION_LOGOS[0],
          }}
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
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
