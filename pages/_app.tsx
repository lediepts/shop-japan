import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Layout from "../components/Layout";
import "../globals.css";
import { Analytics } from "@vercel/analytics/react";

function MyApp({ Component, pageProps }: AppProps & { Component: any }) {
  return (
    <SessionProvider session={pageProps.session as Session}>
      <Analytics />
        <Layout>
          <Component {...pageProps} />
        </Layout>
    </SessionProvider>
  );
}

export default MyApp;
