import { Form, Modal } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import type { IWiki } from '@think/domains';
import { ICreateWiki, useOwnWikis } from 'data/wiki';
import { useRouterQuery } from 'hooks/use-router-query';
import Router from 'next/router';
import { Dispatch, SetStateAction, useRef } from 'react';

interface IProps {
  visible: boolean;
  toggleVisible: Dispatch<SetStateAction<boolean>>;
}

export const WikiCreator: React.FC<IProps> = ({ visible, toggleVisible }) => {
  const $form = useRef<FormApi>();
  const { organizationId } = useRouterQuery<{ organizationId: string }>();
  const { createWiki } = useOwnWikis(organizationId);

  const handleOk = () => {
    $form.current.validate().then((values) => {
      createWiki(values as ICreateWiki).then((res) => {
        toggleVisible(false);
        Router.push({
          pathname: `/app/org/[organizationId]/wiki/[wikiId]`,
          query: { organizationId: res.organizationId, wikiId: res.id },
        });
      });
    });
  };

  const handleCancel = () => {
    toggleVisible(false);
  };

  return (
    <Modal title="创建知识库" visible={visible} onOk={handleOk} onCancel={handleCancel} style={{ maxWidth: '96vw' }}>
      <Form initValues={{ name: '', description: '' }} getFormApi={(formApi) => ($form.current = formApi)}>
        <Form.Input
          noLabel
          autofocus
          field="name"
          style={{ width: '100%' }}
          placeholder="请输入知识库名称"
          maxLength={20}
          rules={[{ required: true, message: '请输入知识库名称' }]}
        ></Form.Input>
        <Form.TextArea
          noLabel
          field="description"
          style={{ width: '100%' }}
          placeholder="请输入知识库简介"
          autosize
          rules={[{ message: '请输入知识库简介' }]}
        ></Form.TextArea>
      </Form>
    </Modal>
  );
};
