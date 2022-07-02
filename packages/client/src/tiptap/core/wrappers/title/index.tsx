import { Button } from '@douyinfe/semi-ui';
import { DOCUMENT_COVERS } from '@think/constants';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { ImageUploader } from 'components/image-uploader';
import { useCallback, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import styles from './index.module.scss';

const images = [
  {
    key: 'placeholers',
    title: '图库',
    images: DOCUMENT_COVERS,
  },
];

export const TitleWrapper = ({ editor, node }) => {
  const toolbarRef = useRef<HTMLDivElement>(null);
  const isEditable = editor.isEditable;
  const { cover } = node.attrs;

  const setCover = useCallback(
    (cover) => {
      editor.commands.command(({ tr }) => {
        const pos = 0;
        tr.setNodeMarkup(pos, undefined, {
          ...node.attrs,
          cover,
        });
        tr.setMeta('scrollIntoView', false);
        return true;
      });
    },
    [editor, node]
  );

  const addRandomCover = useCallback(() => {
    setCover(DOCUMENT_COVERS[~~(Math.random() * DOCUMENT_COVERS.length)]);
  }, [setCover]);

  const portals = useMemo(() => {
    if (!editor.isEditable) return null;

    if (!toolbarRef.current) {
      const editorDOM = editor.view.dom as HTMLDivElement;
      const parent = editorDOM.parentElement;
      const el = window.document.createElement('div');

      parent.style.position = 'relative';
      editorDOM.parentNode.insertBefore(el, editorDOM);
      toolbarRef.current = el;
    }

    return createPortal(
      <div style={{ transform: `translateY(1.5em)`, zIndex: 100 }}>
        <Button onClick={addRandomCover} size={'small'} theme="light" type="tertiary">
          {cover ? '随机封面' : '添加封面'}
        </Button>
      </div>,
      toolbarRef.current
    );
  }, [editor, addRandomCover, cover]);

  return (
    <NodeViewWrapper className={cls(styles.wrap, 'title')}>
      {cover ? (
        <div className={styles.coverWrap} contentEditable={false}>
          <LazyLoadImage src={cover} alt="请选择或移除封面" />
          {isEditable ? (
            <div className={styles.toolbar}>
              <ImageUploader images={images} selectImage={setCover}>
                <Button size="small" theme="solid" type="tertiary">
                  更换封面
                </Button>
              </ImageUploader>
            </div>
          ) : null}
        </div>
      ) : null}
      {portals}
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};
