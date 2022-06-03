import { BackTop } from '@douyinfe/semi-ui';
import { ImageViewer } from 'components/image-viewer';
import { isMobile } from 'helpers/env';
import { safeJSONParse } from 'helpers/json';
import React, { useCallback, useMemo, useRef } from 'react';
import { EditorContent, useEditor } from 'tiptap/core';

import { CollaborationKit } from '../collaboration/kit';
import { Tocs } from '../tocs';
import styles from './index.module.scss';

interface IProps {
  content: string;
}

export const ReaderEditor: React.FC<IProps> = ({ content }) => {
  const $mainContainer = useRef<HTMLDivElement>();
  const json = useMemo(() => {
    const c = safeJSONParse(content);
    const json = c.default || c;
    return json;
  }, [content]);
  const editor = useEditor(
    {
      editable: false,
      extensions: CollaborationKit,
      content: json,
    },
    [json]
  );
  const getTocsContainer = useCallback(() => $mainContainer.current, []);

  return (
    <div className={styles.wrap}>
      <main ref={$mainContainer} id={'js-tocs-container'}>
        <div className={styles.contentWrap}>
          <EditorContent editor={editor} />
        </div>
        {!isMobile && (
          <div className={styles.tocsWrap}>
            <Tocs editor={editor} getContainer={getTocsContainer} />
          </div>
        )}
        <ImageViewer container={$mainContainer.current} />
      </main>
      <BackTop
        target={() => $mainContainer.current}
        style={{ right: isMobile ? 16 : 36, bottom: 65 }}
        visibilityHeight={200}
      />
    </div>
  );
};
