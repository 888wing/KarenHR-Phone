// pages/_app.jsx
import React from "react";
import Head from "next/head";
import { AppProvider } from "../contexts/AppContext";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  return (
    <AppProvider>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        />
        <meta name="description" content="Karen AI - Your Interview Coach" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Component {...pageProps} />
    </AppProvider>
  );
}

export default MyApp;
