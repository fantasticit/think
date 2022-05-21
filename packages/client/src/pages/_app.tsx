import 'tiptap/fix-match-nodes';
import 'viewerjs/dist/viewer.css';
import 'styles/globals.scss';
import 'tiptap/core/styles/index.scss';

import { Theme } from 'hooks/use-theme';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>
      <Theme.Provider>
        <Component {...pageProps} />
      </Theme.Provider>
    </>
  );
}

export default MyApp;
