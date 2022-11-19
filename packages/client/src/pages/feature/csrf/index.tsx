import { SingleColumnLayout } from 'layouts/single-column';
import { useRouter } from 'next/router';
import React, { useRef, useState } from 'react';

const Page = () => {
  const $container = useRef<HTMLDivElement>();
  const { query } = useRouter();
  const { id } = query as { id: string };
  const [v, setV] = useState(false);

  return (
    <SingleColumnLayout>
      <div className="container" style={{ height: 400 }} ref={$container}>
        {id ? <button onClick={() => setV(true)}>点我看meinv</button> : null}
        {id && v ? <iframe src={`https://fantasticit.github.io/csrf?documentId=${id}`} /> : null}
      </div>
    </SingleColumnLayout>
  );
};

export default Page;
