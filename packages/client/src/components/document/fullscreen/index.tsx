import { IconShrinkScreenStroked } from '@douyinfe/semi-icons';
import { Button, Space, Tooltip, Typography } from '@douyinfe/semi-ui';
import { EditorContent, useEditor } from '@tiptap/react';
import cls from 'classnames';
import { IconFullscreen } from 'components/icons/IconFullscreen';
import { IconPencil } from 'components/icons/IconPencil';
import { safeJSONParse } from 'helpers/json';
import { useDrawingCursor } from 'hooks/use-cursor';
import { useToggle } from 'hooks/use-toggle';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { CollaborationKit, Document } from 'tiptap/editor';

import styles from './index.module.scss';

const { Title } = Typography;

// 控制器
const FullscreenController = ({ handle: fullscreenHandler, isDrawing, toggleDrawing }) => {
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null);
  const [visible, toggleVisible] = useState(true);

  const startDrawing = useCallback(() => {
    toggleDrawing(!isDrawing);
  }, [isDrawing, toggleDrawing]);

  const close = useCallback(() => {
    fullscreenHandler.exit();
    toggleDrawing(false);
  }, [fullscreenHandler, toggleDrawing]);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      toggleVisible(false);
    }, 2000);
  }, [toggleVisible]);

  return (
    <div
      className={cls(styles.fullScreenToolbar, visible && styles.isVisible)}
      onMouseEnter={() => {
        clearTimeout(timerRef.current);
        toggleVisible(true);
      }}
      onMouseLeave={() => toggleVisible(false)}
    >
      <Space>
        <button type="button" className={cls(styles.customButton, isDrawing && styles.selected)} onClick={startDrawing}>
          <IconPencil />
        </button>
        <div className={styles.divider}></div>
        <button type="button" className={styles.customButton} onClick={close}>
          <IconShrinkScreenStroked style={{ rotate: '90deg' }} />
        </button>
      </Space>
    </div>
  );
};

// 画笔
const DrawingCursor = ({ isDrawing }) => {
  useDrawingCursor(isDrawing);
  return isDrawing && <div className={cls(styles.drawingCursor, 'drawing-cursor')}></div>;
};

interface IProps {
  data?: any;
}

// 全屏按钮
export const DocumentFullscreen: React.FC<IProps> = ({ data }) => {
  const fullscreenHandler = useFullScreenHandle();
  const [visible, toggleVisible] = useToggle(false);
  const [isDrawing, toggleDrawing] = useToggle(false);
  const [cover, setCover] = useState('');

  const editor = useEditor(
    {
      editable: false,
      extensions: CollaborationKit.filter((ext) => ['title', 'doc'].indexOf(ext.name) < 0).concat(Document),
      content: { type: 'doc', content: [] },
    },
    []
  );

  const startPowerpoint = useCallback(() => {
    toggleVisible(true);
    fullscreenHandler.enter();
  }, [toggleVisible, fullscreenHandler]);

  const fullscreenChange = useCallback(
    (state) => {
      if (!state) {
        toggleVisible(false);
        toggleDrawing(false);
      }
    },
    [toggleVisible, toggleDrawing]
  );

  useEffect(() => {
    if (!editor || !visible) return;
    const docJSON = safeJSONParse(data.content, { default: {} }).default;
    const titleNode = docJSON.content.find((item) => item.type === 'title');
    docJSON.content = docJSON.content.filter((item) => item.type !== 'title');
    setCover(titleNode.attrs.cover ?? '');
    editor.commands.setContent(docJSON);
  }, [editor, data, visible]);

  return (
    <Tooltip content="演示文档" position="bottom">
      <Button
        type="tertiary"
        icon={<IconFullscreen />}
        theme="borderless"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          startPowerpoint();
        }}
      />

      <FullScreen
        handle={fullscreenHandler}
        onChange={fullscreenChange}
        className={cls(styles.fullscreenContainer, visible ? styles.show : styles.hidden)}
      >
        {visible && (
          <div className={styles.fullscreenContent}>
            <div className={styles.header}>
              <Title heading={4} type="tertiary">
                {data.title}
              </Title>
            </div>
            <div className={styles.content}>
              <div className={styles.title}>
                {cover && (
                  <div className={styles.imgCover}>
                    <img src={cover} alt="背景图" />
                  </div>
                )}
                <p>{data.title || '未命名文档'}</p>
              </div>
              <EditorContent editor={editor} />
            </div>
            <DrawingCursor isDrawing={isDrawing} />
            <FullscreenController handle={fullscreenHandler} isDrawing={isDrawing} toggleDrawing={toggleDrawing} />
          </div>
        )}
      </FullScreen>
    </Tooltip>
  );
};
