import type { AppProps } from "next/app";
import { useSafari100vh } from "hooks/use-safari-100vh";
import "styles/globals.scss";

function MyApp({ Component, pageProps }: AppProps) {
  useSafari100vh();

  return <Component {...pageProps} />;
}

export default MyApp;
