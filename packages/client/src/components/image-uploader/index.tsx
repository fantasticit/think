import { Button, ButtonGroup, Col, Popover, Row, SideSheet, Skeleton, Space, TabPane, Tabs } from '@douyinfe/semi-ui';
import { Upload } from 'components/upload';
import { chunk } from 'helpers/chunk';
import { IsOnMobile } from 'hooks/use-on-mobile';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useMemo, useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import styles from './index.module.scss';

interface IProps {
  width?: number;
  mobileHeight?: number;
  images: Array<{
    key: string;
    title: React.ReactNode;
    images: string[];
  }>;
  selectImage: (url: string) => void;
}

const UploadTab = ({ selectImage }) => {
  const [cover, setCover] = useState('');

  const prevent = useCallback((e) => {
    e.stopPropagation();
  }, []);

  const confirm = useCallback(() => {
    selectImage(cover);
  }, [cover, selectImage]);

  const clear = useCallback(() => {
    setCover('');
  }, []);

  return (
    <div className={styles.uploadWrap} onClick={prevent}>
      <Space>
        <Upload onOK={setCover}></Upload>
        {cover ? (
          <ButtonGroup>
            <Button theme="solid" onClick={confirm}>
              确认
            </Button>
            <Button theme="solid" onClick={clear}>
              清除
            </Button>
          </ButtonGroup>
        ) : null}
      </Space>
      {cover ? <img src={cover} className={styles.bigImgItem} /> : null}
    </div>
  );
};

export const ImageUploader: React.FC<IProps> = ({ width = 360, mobileHeight = 370, images, selectImage, children }) => {
  const { isMobile } = IsOnMobile.useHook();
  const [visible, toggleVisible] = useToggle(false);

  const setImage = useCallback(
    (url) => {
      return () => selectImage(url);
    },
    [selectImage]
  );

  const clear = useCallback(() => {
    selectImage('');
  }, [selectImage]);

  const imageTabs = useMemo(
    () =>
      images.map((image) => {
        return (
          <TabPane key={image.key} tab={image.title} itemKey={image.key} style={{ height: 250, overflow: 'auto' }}>
            {chunk(image.images, 4).map((chunk, index) => {
              return (
                <Row gutter={6} key={index} style={{ marginTop: index === 0 ? 0 : 6 }}>
                  {chunk.map((url) => {
                    return (
                      <Col span={6} key={url}>
                        <div className={styles.imgItem}>
                          <LazyLoadImage
                            src={url}
                            delayTime={300}
                            placeholder={<Skeleton loading placeholder={<Skeleton.Image style={{ height: 60 }} />} />}
                            onClick={setImage(url)}
                          />
                        </div>
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
          </TabPane>
        );
      }),
    [images, setImage]
  );

  const content = useMemo(
    () => (
      <div className={styles.wrap}>
        <Tabs
          size="small"
          lazyRender
          keepDOM
          tabBarExtraContent={
            <Button size="small" onClick={clear}>
              清除
            </Button>
          }
        >
          {imageTabs}
          <TabPane tab="上传" itemKey="upload" style={{ textAlign: 'center', height: 250, overflow: 'auto' }}>
            <UploadTab selectImage={(url) => selectImage(url)} />
          </TabPane>
        </Tabs>
      </div>
    ),
    [imageTabs, selectImage, clear]
  );

  return (
    <span>
      {isMobile ? (
        <>
          <SideSheet
            headerStyle={{ borderBottom: '1px solid var(--semi-color-border)' }}
            placement="bottom"
            title={'图片'}
            visible={visible}
            onCancel={toggleVisible}
            height={mobileHeight}
            mask={false}
          >
            {content}
          </SideSheet>
          <span onMouseDown={() => toggleVisible(true)}>{children}</span>
        </>
      ) : (
        <Popover
          showArrow
          zIndex={10000}
          trigger="click"
          position="bottomRight"
          visible={visible}
          onVisibleChange={toggleVisible}
          content={<div style={{ width, maxWidth: '96vw' }}>{content}</div>}
        >
          {children}
        </Popover>
      )}
    </span>
  );
};
