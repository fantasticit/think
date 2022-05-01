import type { AppProps } from 'next/app';
import Head from 'next/head';
import React from 'react';
import { useTheme } from 'hooks/use-theme';
import 'viewerjs/dist/viewer.css';
import 'styles/globals.scss';
import 'tiptap/styles/index.scss';

function MyApp({ Component, pageProps }: AppProps) {
  useTheme();

  return (
    <>
      <Head>
        <meta name="viewport" content="viewport-fit=cover" />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
