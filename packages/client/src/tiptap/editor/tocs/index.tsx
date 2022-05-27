import { Anchor } from '@douyinfe/semi-ui';
import React, { useCallback } from 'react';

import { Editor } from '../react';
import style from './index.module.scss';

interface IToc {
  level: number;
  id: string;
  text: string;
}

const renderToc = (toc) => {
  return (
    <Anchor.Link href={`#${toc.id}`} title={toc.text}>
      {toc.children && toc.children.length && toc.children.map(renderToc)}
    </Anchor.Link>
  );
};

export const Tocs: React.FC<{ tocs: Array<IToc>; editor: Editor }> = ({ tocs = [], editor }) => {
  const getContainer = useCallback(() => {
    return document.querySelector(`#js-reader-container`);
  }, []);

  return (
    <div className={style.wrapper}>
      <main>
        <Anchor autoCollapse getContainer={getContainer} maxWidth={8}>
          {tocs.length && tocs.map(renderToc)}
        </Anchor>
      </main>
    </div>
  );
};
