import type { AppProps } from 'next/app';
import { useSafari100vh } from 'hooks/use-safari-100vh';
import 'viewerjs/dist/viewer.css';
import 'styles/globals.scss';
import 'tiptap/styles/index.scss';

function MyApp({ Component, pageProps }: AppProps) {
  useSafari100vh();

  return <Component {...pageProps} />;
}

export default MyApp;
