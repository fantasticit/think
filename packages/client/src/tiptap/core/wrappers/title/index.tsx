import { Button, ButtonGroup } from '@douyinfe/semi-ui';
import { DOCUMENT_COVERS } from '@think/constants';
import { NodeViewContent, NodeViewWrapper } from '@tiptap/react';
import cls from 'classnames';
import { ImageUploader } from 'components/image-uploader';
import { useCallback } from 'react';
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

  return (
    <NodeViewWrapper className={cls(styles.wrap, 'title')}>
      {cover ? (
        <div className={styles.coverWrap} contentEditable={false}>
          <img src={cover} alt="cover" />
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
      {isEditable && !cover ? (
        <div className={styles.emptyToolbarWrap}>
          <ButtonGroup size={'small'} theme="light" type="tertiary">
            {!cover ? <Button onClick={addRandomCover}>添加封面</Button> : null}
          </ButtonGroup>
        </div>
      ) : null}
      <NodeViewContent></NodeViewContent>
    </NodeViewWrapper>
  );
};
