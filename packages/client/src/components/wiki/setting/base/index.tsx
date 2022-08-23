import { Avatar, Button, Form, Toast } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import { WIKI_AVATARS } from '@think/constants';
import type { IWiki } from '@think/domains';
import { ImageUploader } from 'components/image-uploader';
import { pick } from 'helpers/pick';
import { useCallback, useEffect, useRef, useState } from 'react';

import styles from './index.module.scss';

const images = [
  {
    key: 'placeholers',
    title: '图库',
    images: WIKI_AVATARS,
  },
];

type IUpdateWIKI = Partial<IWiki>;

interface IProps {
  wiki: IWiki;
  update: (arg: IUpdateWIKI) => Promise<void>;
}

const getFormValueFromWiki = (wiki) => {
  return pick(wiki, ['name', 'description', 'avatar']);
};

export const Base: React.FC<IProps> = ({ wiki, update }) => {
  const $form = useRef<FormApi>();
  const [currentCover, setCurrentCover] = useState('');

  const onSubmit = useCallback(() => {
    $form.current.validate().then((values) => {
      update(values).then(() => {
        Toast.success('操作成功');
      });
    });
  }, [update]);

  const setCover = useCallback((url) => {
    $form.current.setValue('avatar', url);
    setCurrentCover(url);
  }, []);

  useEffect(() => {
    if (!wiki) return;
    $form.current.setValues(getFormValueFromWiki(wiki));
    setCurrentCover(wiki.avatar);
  }, [wiki]);

  return (
    <Form
      initValues={getFormValueFromWiki(wiki)}
      style={{ width: '100%' }}
      getFormApi={(formApi) => ($form.current = formApi)}
      onSubmit={onSubmit}
    >
      <Form.Input
        label="名称"
        field="name"
        style={{ width: '100%' }}
        placeholder="请输入知识库名称"
        rules={[{ required: true, message: '请输入知识库名称' }]}
      ></Form.Input>
      <Form.TextArea
        label="描述"
        field="description"
        style={{ width: '100%' }}
        placeholder="请输入知识库简介"
        autosize
        rules={[{ required: true, message: '请输入知识库简介' }]}
      ></Form.TextArea>
      <Form.Slot label="封面">
        <div className={styles.cover}>
          <Avatar
            shape="square"
            src={currentCover}
            style={{
              width: 96,
              height: 96,
              borderRadius: 4,
            }}
          >
            {wiki && wiki.name.charAt(0)}
          </Avatar>
        </div>
        <ImageUploader images={images} selectImage={setCover}>
          <Button>更换封面</Button>
        </ImageUploader>
      </Form.Slot>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Button htmlType="submit" type="primary" theme="solid">
          保存
        </Button>
      </div>
    </Form>
  );
};
