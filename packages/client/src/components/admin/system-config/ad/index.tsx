import React, { useCallback, useRef, useState } from 'react';

import { Avatar, Button, Form, Image, Modal, Space, Table } from '@douyinfe/semi-ui';
import { FormApi } from '@douyinfe/semi-ui/lib/es/form';

import { AdType } from '@think/domains';

import { DataRender } from 'components/data-render';
import { Upload } from 'components/upload';
import { useAd } from 'data/ad';

const { Option } = Form.Select;

const AdTypeTextMap = {
  [AdType.shareDocCover]: '分享文档主图位',
  [AdType.shareDocAside]: '分享文档侧边位',
};

const columns = [
  {
    title: '类型',
    dataIndex: 'type',
    render: (type) => {
      return AdTypeTextMap[type];
    },
  },
  {
    title: '广告图',
    dataIndex: 'cover',
    render: (url) => {
      return (
        <div>
          <Image width={180} height={60} src={url}></Image>
        </div>
      );
    },
  },
  {
    title: '广告链接',
    dataIndex: 'url',
  },
];

export const Ad = () => {
  const { data, loading, error, createAd, deleteAd } = useAd();
  const [visible, toggleVisible] = useState(false);
  const $form = useRef<FormApi>();
  const [currentCover, setCurrentCover] = useState('');

  const columns = useMemo(() => {
    return [
      ...columns,
      {
        title: '操作',
        dataIndex: 'id',
        render: (id) => {
          return (
            <Button
              type="danger"
              onClick={() => {
                deleteAd(id);
              }}
            >
              删除
            </Button>
          );
        },
      },
    ];
  }, [deleteAd]);

  const setCover = useCallback((url) => {
    $form.current.setValue('cover', url);
    setCurrentCover(url);
  }, []);

  const handleOk = useCallback(() => {
    $form.current.validate().then((values) => {
      if (!values.email) {
        delete values.email;
      }
      createAd(values).then(() => {
        $form.current.reset();
        setCover('');
        toggleVisible(false);
      });
    });
  }, [createAd, setCover, toggleVisible]);

  return (
    <DataRender
      loading={loading}
      error={error}
      normalContent={() => (
        <div style={{ marginTop: 16 }}>
          <Button
            htmlType="submit"
            type="primary"
            theme="solid"
            onClick={() => {
              toggleVisible(true);
            }}
            style={{ margin: '16px 0' }}
          >
            添加
          </Button>
          <Modal
            title="添加广告"
            visible={visible}
            onCancel={() => {
              toggleVisible(false);
            }}
            style={{ maxWidth: '96vw' }}
            onOk={handleOk}
          >
            <Form
              initValues={{ type: AdType.shareDocCover, cover: '', url: '' }}
              getFormApi={(formApi) => ($form.current = formApi)}
              labelPosition="left"
            >
              <Form.Select field="type" label={{ text: '类型' }}>
                <Option value={AdType.shareDocCover}>{AdTypeTextMap[AdType.shareDocCover]}</Option>
                <Option value={AdType.shareDocAside}>{AdTypeTextMap[AdType.shareDocAside]}</Option>
              </Form.Select>

              <Form.Slot label="图片">
                <Space align="end">
                  <Avatar src={currentCover} shape="square"></Avatar>
                  <Upload onOK={setCover} />
                </Space>
              </Form.Slot>

              <Form.Input label="链接" field="url" style={{ width: '100%' }} placeholder="请输入跳转链接"></Form.Input>
            </Form>
          </Modal>
          <Table columns={columns} dataSource={data} pagination={false} />
        </div>
      )}
    />
  );
};
