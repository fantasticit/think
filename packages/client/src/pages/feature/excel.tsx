import type { NextPage } from 'next';
import React, { useEffect, useMemo, useRef } from 'react';
import { SingleColumnLayout } from 'layouts/single-column';

const Page: NextPage = () => {
  const $container = useRef<HTMLDivElement>();

  useEffect(() => {
    import('mind-elixir').then((module) => {
      const MindElixir = module.default;
      const ME = new MindElixir({
        el: '#js-mind-map',
        direction: MindElixir.LEFT,
        data: { nodeData: { id: '078b6f27dc8acf92', topic: '中心节点', root: true, children: [] }, linkData: {} },
        draggable: true, // default true
        contextMenu: true, // default true
        toolBar: true, // default true
        nodeMenu: false, // default true
        keypress: true, // default true
        locale: 'zh_CN',
      });
      ME.init();

      setTimeout(() => {
        console.log(ME, ME.getAllData());
      }, 1000);
    });
  }, []);

  return (
    <SingleColumnLayout>
      <div className="container" id="js-mind-map" style={{ height: 400 }} ref={$container}>
        1
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
